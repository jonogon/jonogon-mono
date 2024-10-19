import { ImageResponse } from '@vercel/og';
import { NextRequest } from 'next/server';
import { trpcVanilla } from '@/trpc/server';


export const runtime = 'edge';


export async function GET(req: NextRequest) {
  const [interSemiBold, interMedium] = await Promise.all([
    fetch(new URL('../../../../public/fonts/Inter-SemiBold.woff', import.meta.url))
      .then((res) => res.arrayBuffer()),
    fetch(new URL('../../../../public/fonts/Inter-Medium.woff', import.meta.url))
      .then((res) => res.arrayBuffer())
  ]);

  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');

  if (!id) {
    return new Response('Missing petition ID', { status: 400 });
  }

  const petition = await trpcVanilla.petitions.get.query({ id });

  if (!petition) {
    return new Response('Petition not found', { status: 404 });
  }

  const { created_at, petition_upvote_count, petition_downvote_count, petition_comment_count } = petition.data;

  const formattedDate = new Date(created_at).toLocaleDateString('en-GB', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const attachment = petition.data.attachments.find((a: any) => a.type === 'image');

  return new ImageResponse(
    (
      <div
        style={{
          width: '1200px',
          height: '630px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'flex-start',
          position: 'relative',
          background: '#F7F2EE',
        }}
      >
        {attachment && (
          <img
            src={attachment.attachment.replace('$CORE_HOSTNAME', req.headers.get('host')?.split(':')[0] || '')}
            width={1241}
            height={930}
            style={{
              width: '100%',
              height: '487px',
              objectFit: 'cover',
            }}
          />
        )}
        <div
          style={{
            display: 'flex',
            position: 'absolute',
            top: '515px',
            left: '40px',
            width: '1100.29px',
            height: '64px',
            flexShrink: 0,
          }}
        >
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '48px'
          }}>
            {/* Upvotes */}
            <div style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '16px',
            }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" fill="none">
                <path d="M20 13.3333L18.6853 13.1147C18.6536 13.3056 18.6638 13.5011 18.7152 13.6877C18.7667 13.8743 18.8581 14.0475 18.9832 14.1951C19.1083 14.3428 19.2641 14.4615 19.4397 14.5429C19.6152 14.6244 19.8065 14.6666 20 14.6667V13.3333ZM5.33333 13.3333V12C4.97971 12 4.64057 12.1405 4.39052 12.3905C4.14048 12.6406 4 12.9797 4 13.3333H5.33333ZM8 28H23.1467V25.3333H8V28ZM24.7467 12H20V14.6667H24.7467V12ZM21.316 13.552L22.3893 7.10533L19.76 6.66667L18.6853 13.1147L21.316 13.552ZM19.76 4H19.4747V6.66667H19.76V4ZM15.036 6.37467L11.684 11.4067L13.9027 12.8867L17.2573 7.85467L15.036 6.37467ZM10.5733 12H5.33333V14.6667H10.5733V12ZM4 13.3333V24H6.66667V13.3333H4ZM27.0693 24.784L28.6693 16.784L26.056 16.2613L24.456 24.2613L27.0693 24.784ZM11.684 11.4067C11.5622 11.5892 11.3959 11.7389 11.2024 11.8424C11.0089 11.9459 10.7928 12 10.5733 12V14.6667C11.2318 14.6666 11.8801 14.504 12.4607 14.1933C13.0412 13.8825 13.5361 13.4332 13.9013 12.8853L11.684 11.4067ZM22.3893 7.10533C22.453 6.72338 22.4328 6.33214 22.33 5.95881C22.2272 5.58548 22.0443 5.23901 21.7941 4.94349C21.5439 4.64797 21.2323 4.41049 20.8811 4.24755C20.5298 4.08462 20.1472 4.00015 19.76 4V6.66667L22.3893 7.10533ZM24.7467 14.6667C24.944 14.6666 25.1388 14.7103 25.3172 14.7946C25.4956 14.879 25.653 15.0019 25.7781 15.1544C25.9032 15.307 25.9929 15.4854 26.0408 15.6768C26.0886 15.8682 26.0947 16.0679 26.056 16.2613L28.6693 16.784C28.7853 16.2038 28.7711 15.6051 28.6278 15.031C28.4845 14.457 28.2156 13.9219 27.8405 13.4643C27.4654 13.0067 26.9935 12.638 26.4587 12.3848C25.924 12.1316 25.3397 12.0002 24.748 12L24.7467 14.6667ZM23.1467 28C24.0715 28.0001 24.9678 27.6796 25.683 27.0933C26.3982 26.5069 26.8881 25.6909 27.0693 24.784L24.456 24.2613C24.3955 24.5639 24.232 24.8362 23.9932 25.0317C23.7544 25.2271 23.4552 25.3338 23.1467 25.3333V28ZM19.4747 4C18.5967 4.00002 17.7324 4.21677 16.9583 4.63102C16.1842 5.04526 15.523 5.6442 15.036 6.37467L17.2573 7.85467C17.5008 7.48931 17.8293 7.18971 18.2164 6.98247C18.6034 6.77522 19.0356 6.66675 19.4747 6.66667V4ZM8 25.3333C7.64638 25.3333 7.30724 25.1929 7.05719 24.9428C6.80714 24.6928 6.66667 24.3536 6.66667 24H4C4 25.0609 4.42143 26.0783 5.17157 26.8284C5.92172 27.5786 6.93913 28 8 28V25.3333Z" fill="#EF4335"/>
                <path d="M10.6666 13.3334V26.6667" stroke="#EF4335" strokeWidth="2" />
              </svg>
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'flex-start',
                width: '119px',
              }}>
                <div style={{
                  display: 'flex',
                  color: '#4F4F4F',
                  fontSize: '32px',
                  fontFamily: '"InterSemiBold"',
                  fontWeight: '600',
                  wordWrap: 'break-word',
                }}>
                  {petition_upvote_count}
                </div>
                <div style={{
                  display: 'flex',
                  color: '#4e4e4e',
                  fontSize: '16px',
                  fontFamily: '"InterMedium"',
                  fontWeight: '500',
                  wordWrap: 'break-word',
                }}>
                  Upvotes
                </div>
              </div>
            </div>
            {/* Downvotes */}
            <div style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '16px',
            }}>
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M20 18.6667L18.6853 18.8853C18.6536 18.6944 18.6638 18.4989 18.7152 18.3123C18.7667 18.1257 18.8581 17.9525 18.9832 17.8049C19.1083 17.6572 19.2641 17.5385 19.4397 17.4571C19.6152 17.3756 19.8065 17.3334 20 17.3333V18.6667ZM5.33333 18.6667V20C4.97971 20 4.64057 19.8595 4.39052 19.6095C4.14048 19.3594 4 19.0203 4 18.6667H5.33333ZM8 4H23.1467V6.66667H8V4ZM24.7467 20H20V17.3333H24.7467V20ZM21.316 18.448L22.3893 24.8947L19.76 25.3333L18.6853 18.8853L21.316 18.448ZM19.76 28H19.4747V25.3333H19.76V28ZM15.036 25.6253L11.6827 20.5933L13.9013 19.1133L17.256 24.1453L15.036 25.6253ZM10.5733 20H5.33333V17.3333H10.5733V20ZM4 18.6667V8H6.66667V18.6667H4ZM27.0693 7.216L28.6693 15.216L26.056 15.7387L24.456 7.73867L27.0693 7.216ZM11.6827 20.5933C11.5609 20.4108 11.3959 20.2611 11.2024 20.1576C11.0089 20.0541 10.7928 20 10.5733 20V17.3333C11.2318 17.3334 11.8801 17.496 12.4607 17.8067C13.0412 18.1175 13.5361 18.5668 13.9013 19.1147L11.6827 20.5933ZM22.3893 24.8947C22.453 25.2766 22.4328 25.6679 22.33 26.0412C22.2272 26.4145 22.0443 26.761 21.7941 27.0565C21.5439 27.352 21.2323 27.5895 20.8811 27.7524C20.5298 27.9154 20.1472 27.9999 19.76 28V25.3333L22.3893 24.8947ZM24.7467 17.3333C24.944 17.3334 25.1388 17.2897 25.3172 17.2054C25.4956 17.121 25.653 16.9981 25.7781 16.8456C25.9032 16.693 25.9929 16.5146 26.0408 16.3232C26.0886 16.1318 26.0947 15.9321 26.056 15.7387L28.6693 15.216C28.7853 15.7962 28.7711 16.3949 28.6278 16.969C28.4845 17.543 28.2156 18.0781 27.8405 18.5357C27.4654 18.9933 26.9935 19.362 26.4587 19.6152C25.924 19.8684 25.3397 19.9998 24.748 20L24.7467 17.3333ZM23.1467 4C24.0715 3.99994 24.9678 4.32035 25.683 4.9067C26.3982 5.49305 26.8881 6.30911 27.0693 7.216L24.456 7.73867C24.3955 7.43607 24.232 7.16382 23.9932 6.96834C23.7544 6.77285 23.4552 6.66624 23.1467 6.66667V4ZM19.4747 28C18.5967 28 17.7324 27.7832 16.9583 27.369C16.1842 26.9547 15.523 26.3558 15.036 25.6253L17.256 24.1453C17.4994 24.5107 17.8293 24.8103 18.2164 25.0175C18.6034 25.2248 19.0356 25.3333 19.4747 25.3333V28ZM8 6.66667C7.64638 6.66667 7.30724 6.80714 7.05719 7.05719C6.80714 7.30724 6.66667 7.64638 6.66667 8H4C4 6.93913 4.42143 5.92172 5.17157 5.17157C5.92172 4.42143 6.93913 4 8 4V6.66667Z" fill="#EF4335"/>
                <path d="M10.6666 18.6667V5.33337" stroke="#EF4335" stroke-width="2"/>
              </svg>
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'flex-start',
                width: '119px',
              }}>
                <div style={{
                  display: 'flex',
                  color: '#4F4F4F',
                  fontSize: '32px',
                  fontFamily: '"InterSemiBold"',
                  fontWeight: '600',
                  wordWrap: 'break-word',
                }}>
                  {petition_downvote_count}
                </div>
                <div style={{
                  display: 'flex',
                  color: '#4e4e4e',
                  fontSize: '16px',
                  fontFamily: '"InterMedium"',
                  fontWeight: '500',
                  wordWrap: 'break-word',
                }}>
                  Downvotes
                </div>
              </div>
            </div>
            {/* Comments */}
            <div style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '16px',
            }}>
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M16 30.6667C15.6464 30.6667 15.3073 30.5262 15.0572 30.2762C14.8072 30.0261 14.6667 29.687 14.6667 29.3334V25.3334H9.33337C8.62613 25.3334 7.94785 25.0524 7.44776 24.5523C6.94766 24.0522 6.66671 23.374 6.66671 22.6667V9.33337C6.66671 8.62613 6.94766 7.94785 7.44776 7.44776C7.94785 6.94766 8.62613 6.66671 9.33337 6.66671H28C28.7073 6.66671 29.3856 6.94766 29.8857 7.44776C30.3858 7.94785 30.6667 8.62613 30.6667 9.33337V22.6667C30.6667 23.374 30.3858 24.0522 29.8857 24.5523C29.3856 25.0524 28.7073 25.3334 28 25.3334H22.5334L17.6 30.28C17.3334 30.5334 17 30.6667 16.6667 30.6667H16ZM17.3334 22.6667V26.7734L21.44 22.6667H28V9.33337H9.33337V22.6667H17.3334ZM4.00004 20H1.33337V4.00004C1.33337 3.2928 1.61433 2.61452 2.11442 2.11442C2.61452 1.61433 3.2928 1.33337 4.00004 1.33337H25.3334V4.00004H4.00004V20Z" fill="#EF4335"/>
              </svg>
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'flex-start',
                width: '119px',
              }}>
                <div style={{
                  display: 'flex',
                  color: '#4F4F4F',
                  fontSize: '32px',
                  fontFamily: '"InterSemiBold"',
                  fontWeight: '600',
                  wordWrap: 'break-word',
                }}>
                  {petition_comment_count}
                </div>
                <div style={{
                  display: 'flex',
                  color: '#4e4e4e',
                  fontSize: '16px',
                  fontFamily: '"InterMedium"',
                  fontWeight: '500',
                  wordWrap: 'break-word',
                }}>
                  Comments
                </div>
              </div>
            </div>
          </div>
          <div style={{
            display: 'flex',
            position: 'absolute',
            top: '18px',
            right: '100px',
            color: '#4F4F4F',
            fontFamily: '"InterSemiBold"',
            fontSize: '1.5rem',
            fontStyle: 'normal',
            fontWeight: '600',
            lineHeight: '2rem',
            textAlign: 'right',
            whiteSpace: 'nowrap',
          }}>
            {formattedDate}
          </div>
          <div style={{
            display: 'flex',
            position: 'absolute',
            top: '0px',
            left: '1023px',
            width: '57.29px',
            height: '64px',
            flexShrink: 0,
          }}>
            <svg width="58" height="64" viewBox="0 0 58 64" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path fill-rule="evenodd" clip-rule="evenodd" d="M34.1875 14.2477C36.3155 11.6358 38.7171 9.03536 41.377 6.56186C50.6432 15.182 57.2903 29.2631 57.2903 36.0902C57.2903 48.3564 50.0351 58.8753 39.7073 63.3362V57.4149L43.7993 51.7289L45.0411 46.1603L43.7332 47.8906L27.6159 35.9551L26.4657 36.0608L26.9945 36.2933L34.202 52.3796L32.2865 52.6411L25.5984 37.7087L20.9603 35.6518L20.4965 32.068L25.0661 34.3248L29.2822 33.9378L31.2533 29.8903L18.3944 23.6048L9.03936 36.679L20.7609 54.3993L19.2676 64C8.05285 59.9966 0 49.013 0 36.0902C0 26.9087 8.91832 11.6845 21.4839 0C26.3791 4.55357 30.7015 9.43523 34.1875 14.2477ZM45.6939 31.8914L38.4087 41.5028L43.3784 45.2911L50.6636 35.675L45.6939 31.8914ZM44.6643 30.1692L36.9175 40.3953L31.6998 36.4269L39.4464 26.2008L44.6643 30.1692ZM31.4933 33.631L33.7312 29.0328L28.9715 26.7063L33.1735 21.1621L38.1026 24.9156L31.4933 33.631ZM25.9184 16.4046L31.3264 20.5218L27.2716 25.8731L21.0485 22.832L25.9184 16.4046Z" fill="#EF4335"/>
            </svg>
          </div>
        </div>
        {/* Bottom Red Rectangle */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            width: '1200px',
            height: '24px',
            flexShrink: 0,
            background: '#EF4335',
          }}
        />
      </div>
    ),
    {
      width: 1200,
      height: 630,
      fonts: [
        {
          name: 'InterSemiBold',
          data: interSemiBold,
          style: 'normal',
          weight: 600,
        },
        {
          name: 'InterMedium',
          data: interMedium,
          style: 'normal',
          weight: 500,
        },
      ],
    }
  );
}
