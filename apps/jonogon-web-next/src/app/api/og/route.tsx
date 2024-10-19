import { ImageResponse } from '@vercel/og';
import { NextRequest } from 'next/server';
import { trpcVanilla } from '@/trpc/server';

export const runtime = 'edge';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');

  if (!id) {
    return new Response('Missing petition ID', { status: 400 });
  }

  const petition = await trpcVanilla.petitions.get.query({ id });

  if (!petition) {
    return new Response('Petition not found', { status: 404 });
  }

  const { title, created_at, petition_upvote_count, petition_downvote_count, petition_comment_count } = petition.data;

  const formattedDate = new Date(created_at).toLocaleDateString('en-GB', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'white',
          fontSize: 32,
          fontWeight: 600,
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
          <div style={{ display: 'flex', marginBottom: 40, textAlign: 'center', maxWidth: '80%' }}>{title}</div>
          <div style={{ display: 'flex', marginBottom: 20, fontSize: 16, color: '#666' }}>
            Debug info:
            {JSON.stringify(petition.data, null, 2)}
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', padding: '20px', backgroundColor: '#f0f0f0' }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <span style={{ display: 'flex', marginRight: '10px' }}>👍</span>
              <span style={{ display: 'flex' }}>{petition_upvote_count}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <span style={{ display: 'flex', marginRight: '10px' }}>👎</span>
              <span style={{ display: 'flex' }}>{petition_downvote_count}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <span style={{ display: 'flex', marginRight: '10px' }}>💬</span>
              <span style={{ display: 'flex' }}>{petition_comment_count}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <span style={{ display: 'flex' }}>{formattedDate}</span>
            </div>
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    },
  );
}
