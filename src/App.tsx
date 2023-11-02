import { useRequest } from 'ahooks';
import ky from 'ky';

export type PoetryResult = {
  id: string;
  createdTime: string;
  updatedTime: string;
  deletedTime: string;
  title: string;
  source: string;
  paragraphs: string[];
  author: string;
  dynasty: string;
  tags: string[];
  chapter: string;
  rhythmic: string;
  notes: string;
  originId: string;
  prologue: string;
};

const filterNull = (arr: (string | null | undefined)[]) => {
  return arr.filter((i) => !!i) as string[];
};

const queryPoetry = async () => {
  // 跨域
  const res = await ky
    .get('https://ims-api.dctxf.com/poetry/random', {
      mode: 'cors',
    })
    .json();
  return res as PoetryResult;
};

function App() {
  const { data } = useRequest(queryPoetry, {});

  return (
    <div className='p-10 bg-slate-50 min-h-screen'>
      <h1 className='text-4xl font-bold pb-4'>{data?.title}</h1>
      <h2 className='pb-2'>
        <span className='text-2xl font-bold mr-2'>
          {filterNull([data?.dynasty, data?.author]).join('-')}
        </span>
        <span className=''>
          {filterNull([data?.source, data?.chapter]).join(' ')}
        </span>
      </h2>

      <ul className='list-none'>
        {data?.paragraphs.map((i) => {
          return (
            <li key={i} className='list-none'>
              {i}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default App;
