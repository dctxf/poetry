import { Icon } from '@iconify/react/dist/iconify.js';
import { useRequest } from 'ahooks';
import classNames from 'classnames';
import copy from 'copy-to-clipboard';
import ky from 'ky';
import { pinyin } from 'pinyin-pro';
import {
  FC,
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import { Toaster, toast } from 'sonner';

const BASE_URL = 'https://ims-api.dctxf.com';
// const BASE_URL = 'http://127.0.0.1:3000';

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
    .get(`${BASE_URL}/poetry/random`, {
      mode: 'cors',
    })
    .json();
  return res as PoetryResult;
};

export type FontPinyinProps = {
  fonts?: string;
  hasPinyin?: boolean;
  className?: string;
};
export const FontPinyin: FC<FontPinyinProps> = ({
  fonts,
  hasPinyin,
  className,
}) => {
  const fontsArr = fonts?.split('');

  return (
    <div className=''>
      {fontsArr?.map((i, index) => {
        return (
          <div
            key={i + index}
            className={classNames(
              'inline-flex flex-col items-center px-1',
              hasPinyin ? 'w-8' : 'w-auto'
            )}
          >
            {hasPinyin && (
              <div className='text-xs text-gray-400'>{pinyin(i)}</div>
            )}
            <div className={className}>{i}</div>
          </div>
        );
      })}
    </div>
  );
};

export type ButtonProps = {
  className?: string;
  active?: boolean;
  icon?: React.ReactNode;
  label?: React.ReactNode;
  onClick?: () => void;
};

export const Button: FC<ButtonProps> = ({
  className,
  active,
  label,
  icon,
  onClick,
}) => {
  return (
    <span
      className={classNames(
        'flex items-center cursor-pointer py-1 px-2 transition-all mr-2 last:mr-0',
        active
          ? 'bg-green-400 text-white hover:bg-green-500'
          : 'bg-slate-100 text-gray-600 hover:bg-slate-200',
        className
      )}
      onClick={onClick}
    >
      {icon}
      <span className='ml-2'>{label}</span>
    </span>
  );
};

export type AudioPlayerProps = {
  //
  onPlay?: () => void;
  onEnd?: () => void;
};
export type AudioPlayerRef = {
  play: (text?: string) => void;
};

const AudioPlayer = forwardRef<AudioPlayerRef, AudioPlayerProps>(
  ({ onPlay = () => {}, onEnd = () => {} }, ref) => {
    const textRef = useRef<string>('');
    const audioRef = useRef<HTMLAudioElement>(new Audio());

    useEffect(() => {
      if (audioRef.current) {
        audioRef.current.addEventListener('play', onPlay);
        audioRef.current.addEventListener('ended', onEnd);
      }
      return () => {
        if (audioRef.current) {
          audioRef.current.removeEventListener('play', onPlay);
          // eslint-disable-next-line react-hooks/exhaustive-deps
          audioRef.current.removeEventListener('ended', onEnd);
        }
      };
    }, [onEnd, onPlay]);

    useImperativeHandle(
      ref,
      () => {
        return {
          play(text) {
            const audio = audioRef.current;
            if (!text) return;
            if (textRef.current === text) {
              audio.currentTime = 0;
              audio.play();
              return;
            }
            textRef.current = text;
            audio.src = `${BASE_URL}/ms/tts?text=${text}`;
            audio.play();
          },
        };
      },
      []
    );
    return null;
  }
);

function App() {
  const { data, refresh, loading } = useRequest(queryPoetry, {});
  const [hasPinyin, setHasPinyin] = useState(false);
  const [playing, setPlaying] = useState(false);

  const playerRef = useRef<AudioPlayerRef>(null);

  return (
    <div className='p-2 bg-slate-50 min-h-screen text-center'>
      <Toaster />
      <div className='flex items-center justify-center pb-4'>
        <Button
          onClick={refresh}
          icon={<Icon icon='solar:refresh-square-outline' />}
          label='换一首'
        ></Button>
        <Button
          onClick={() => {
            playerRef.current?.play((data?.paragraphs).join('\n'));
          }}
          icon={<Icon icon='fluent:immersive-reader-16-regular' />}
          label='朗读'
          active={playing}
        ></Button>
        <Button
          active={hasPinyin}
          onClick={() => {
            setHasPinyin(!hasPinyin);
          }}
          icon={<Icon icon='material-symbols:language-pinyin-rounded' />}
          label='拼音'
        ></Button>
        <Button
          icon={<Icon icon='material-symbols:content-copy-outline' />}
          label='复制'
          onClick={() => {
            copy(
              `${filterNull([data?.source, data?.chapter]).join(' ')}\n${
                data?.title
              }\n${filterNull([data?.dynasty, data?.author]).join(
                '-'
              )}\n${data?.paragraphs.join('\n')}`
            );
            toast.success('复制成功', {
              description: data?.title,
            });
          }}
        ></Button>
      </div>
      <div className='flex justify-center mb-2'>
        <AudioPlayer
          ref={playerRef}
          onPlay={() => setPlaying(true)}
          onEnd={() => setPlaying(false)}
        />
      </div>
      <div className='flex justify-center w-120 h-40 mb-2'>
        {!loading && (
          <img
            src='https://unsplash.it/400/200?random'
            alt=''
            className='w-120 h-40 object-cover bg-slate-200'
          />
        )}
      </div>
      <div className={classNames(loading && 'animate-pulse')}>
        <FontPinyin
          fonts={filterNull([data?.source, data?.chapter]).join(' ')}
          hasPinyin={false}
        ></FontPinyin>
        <FontPinyin
          fonts={data?.title}
          hasPinyin={hasPinyin}
          className='text-2xl font-bold pb-4'
        ></FontPinyin>
        <h2 className='p-2'>
          <FontPinyin
            fonts={filterNull([data?.dynasty, data?.author]).join('-')}
            hasPinyin={hasPinyin}
            className='text-xl font-bold'
          ></FontPinyin>
        </h2>

        <ul className='list-none leading-6'>
          {data?.paragraphs
            .join('')
            .split(/，|。/)
            .map((i) => {
              return (
                <FontPinyin
                  fonts={i}
                  hasPinyin={hasPinyin}
                  key={i}
                  className='list-none'
                ></FontPinyin>
              );
            })}
        </ul>
      </div>
    </div>
  );
}

export default App;
