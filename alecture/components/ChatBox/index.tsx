import React, { useCallback, useEffect, useRef } from "react";
import { ChatArea, MentionsTextarea, Form, SendButton, Toolbox, EachMention } from "@components/ChatBox/styles";
import autosize from "autosize";
import { Mention, SuggestionDataItem } from "react-mentions";
import { useParams } from "react-router";
import useSWR from "swr";
import fetcher from "@utils/fetcher";
import { IUser } from "@typings/db";
import gravatar from "gravatar";

interface Props {
  chat: string;
  onSubmitForm: (e: any) => void;
  onChangeChat: (e: any) => void;
  placeholder?: string;
}

const ChatBox = ({ chat, onSubmitForm, onChangeChat, placeholder }: Props) => {
  const { workspace } = useParams<{ workspace: string }>();

  const {
    data: userData,
    error,
    mutate,
  } = useSWR("http://localhost:3095/api/users", fetcher, {
    dedupingInterval: 2000, // 호출시간
  });
  const { data: memberData } = useSWR(
    userData ? `http://localhost:3095/api/workspaces/${workspace}/members` : null,
    fetcher,
  );

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      autosize(textareaRef.current);
    }
  }, []);

  const onKeyDownChat = useCallback(
    (e: any) => {
      if (e.key === "Enter") {
        if (!e.shiftKey) {
          e.preventDefault();
          onSubmitForm(e);
        }
      }
    },
    [onSubmitForm],
  );
  const renderSuggestion = useCallback(
    (
      suggestion: SuggestionDataItem,
      search: string,
      highlightedDisplay: React.ReactNode,
      index: number,
      focus: boolean,
    ): React.ReactNode => {
      if (!memberData) return;
      return (
        <EachMention focus={focus}>
          <img
            src={gravatar.url(memberData[index].email, {
              s: "20px",
              d: "retro",
            })}
            alt={memberData[index].nickname}
          />
          <span>{highlightedDisplay}</span>
        </EachMention>
      );
    },
    [memberData],
  );
  return (
    <ChatArea>
      <Form onSubmit={onSubmitForm}>
        <MentionsTextarea
          id="edito-chat"
          value={chat}
          onChange={onChangeChat}
          onKeyPress={onKeyDownChat}
          placeholder={placeholder}
          inputRef={textareaRef}
          allowSuggestionsAboveCursor
        >
          <Mention
            appendSpaceOnAdd
            trigger="@"
            data={memberData?.map((v: IUser) => ({ id: v.id, display: v.nickname })) || []}
            renderSuggestion={renderSuggestion}
          />
        </MentionsTextarea>
        <Toolbox>
          <SendButton
            className={
              "c-button-unstyled c-icon_button c-icon_button--light c-icon_button--size_medium c-texty_input__button c-texty_input__button--send" +
              (chat?.trim() ? "" : " c-texty_input__button--disabled")
            }
            data-qa="texty_send_button"
            aria-label="Send message"
            data-sk="tooltip_parent"
            type="submit"
            disabled={!chat?.trim()}
          >
            <i className="c-icon c-icon--paperplane-filled" aria-hidden="true" />
          </SendButton>
        </Toolbox>
      </Form>
    </ChatArea>
  );
};

export default ChatBox;
