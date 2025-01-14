'use client';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import { useEffect, useState } from 'react';

export default function ClubComments({ club }) {
  const { data: session } = useSession();
  const [commentsData, setCommentsData] = useState([]);
  const [comment, setComment] = useState('');
  useEffect(
    () => async () => {
      const res = await fetch('/api/clubs/get-comments', {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
        },
        body: JSON.stringify({ club }),
      });
      const data = await res.json();
      setCommentsData(data.data);
    },
    [club, comment]
  );

  const postComment = async () => {
    const userId = session.user.id;
    const res = await fetch('/api/clubs/add-comment', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify({ userId, comment, club }),
    });
    const data = await res.json();
    if (res.ok) setComment('');
    console.log(data);
  };

  return (
    <section className='bg-white dark:bg-gray-900 py-8 lg:py-16'>
      <div className='max-w-2xl mx-auto px-4'>
        <div className='flex justify-between items-center mb-6'>
          <h2 className='text-lg lg:text-2xl font-bold text-gray-900 dark:text-white'>
            Discussion
          </h2>
        </div>
        <form
          className='mb-6'
          onSubmit={(e) => {
            e.preventDefault();
            postComment();
          }}
        >
          <div className='py-2 px-4 mb-4 bg-white rounded-lg rounded-t-lg border border-gray-200 dark:bg-gray-800 dark:border-gray-700'>
            <label htmlFor='comment' className='sr-only'>
              Your comment
            </label>
            <textarea
              id='comment'
              rows='6'
              className='px-0 w-full text-sm text-gray-900 border-0 focus:ring-0 focus:outline-none dark:text-white dark:placeholder-gray-400 dark:bg-gray-800'
              placeholder='Write a comment...'
              value={comment}
              required
              onChange={(e) => setComment(e.target.value)}
            ></textarea>
          </div>
          <input
            type='submit'
            className='inline-flex items-center py-2.5 px-4 text-xs font-medium text-center text-white bg-blue-700 rounded-lg focus:ring-4 focus:ring-blue-200 dark:focus:ring-blue-900 hover:bg-blue-800'
            value='Post comment'
          />
        </form>
        {commentsData.length
          ? commentsData.map((value) => (
              <article
                key={value.id}
                className='p-6 mb-6 text-base bg-white rounded-lg dark:bg-gray-900'
              >
                <footer className='flex justify-between items-center mb-2'>
                  <div className='flex items-center'>
                    <p className='inline-flex items-center mr-3 text-sm text-gray-900 dark:text-white'>
                      <Image
                        height={100}
                        width={100}
                        src={`/users/${value.avatar}`}
                        className='mr-2 w-6 h-6 rounded-full'
                        alt={value.username}
                      />
                      {value.username}
                    </p>
                    <p className='text-sm text-gray-600 dark:text-gray-400'>
                      <time dateTime={'2023-04-24'} title='April 24, 2023'>
                        {value.createdAt}
                      </time>
                    </p>
                  </div>
                </footer>
                <p className='text-gray-500 dark:text-gray-400'>
                  {value.comment}
                </p>
                <div className='flex items-center mt-4 space-x-4'>
                  <button
                    type='button'
                    className='flex items-center text-sm text-gray-500 hover:underline dark:text-gray-400'
                  >
                    <svg
                      aria-hidden='true'
                      className='mr-1 w-4 h-4'
                      fill='none'
                      stroke='currentColor'
                      viewBox='0 0 24 24'
                      xmlns='http://www.w3.org/2000/svg'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth='2'
                        d='M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z'
                      ></path>
                    </svg>
                    Reply
                  </button>
                </div>
              </article>
            ))
          : ''}
      </div>
    </section>
  );
}
