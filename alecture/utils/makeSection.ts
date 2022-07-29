import dayjs from "dayjs";
import { IDM } from "@typings/db";

export default function makeSection(chatList: IDM[]) {
  const sections: { [key: string]: IDM[] } = {};
  // { [key: string]: IDM[] }  => { 'hello': [{ id: 1 }, { id: 2 }] }
  chatList.forEach((chat: IDM) => {
    const monthDate = dayjs(chat.createdAt).format("YYYY-MM-DD");
    if (Array.isArray(sections[monthDate])) {
      sections[monthDate].push(chat);
    } else {
      sections[monthDate] = [chat];
    }
  });
  return sections;
}

// [{id : 1, createdAt: '2022-07-01'}, {id : 2, createdAt: '2022-07-02'}, {id : 3, createdAt: '2022-07-03'} ,{id : 4, createdAt: '2022-07-01'}]
// sections = {
//  '2022-07-01': [1, 4],
//  '2022-07-02': [2],
//  '2022-07-03': [3],
// }
