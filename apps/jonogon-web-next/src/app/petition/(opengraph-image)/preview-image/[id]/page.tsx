import {trpcVanilla} from '@/trpc/server';
import {Inter} from 'next/font/google';
import PreviewImageLayout from '../layout';
const inter = Inter({subsets: ['latin']});

const getBaseUrl = () =>
    process.env.NODE_ENV === 'development'
        ? new URL('http://localhost:12001/static/')
        : new URL('https://static.jonogon.org/');

interface OGData {
    title: string;
    location: string;
    target: string;
    created_at: string;
    petition_upvote_count: number;
    petition_downvote_count: number;
    petition_comments_count: number;
    main_image: string | null;
    created_by_id: string;
    created_by_name: string | null;
    created_by_image: string | null;
}

export default async function PetitionPreviewImage({
    params,
}: {
    params: {id: string};
}) {
    const ogData = await trpcVanilla.petitions.getOgImageDetails.query({
        id: params.id,
    });
    const {
        title,
        location,
        target,
        created_at,
        petition_upvote_count,
        petition_downvote_count,
        petition_comments_count,
        main_image,
        created_by_id,
        created_by_name,
        created_by_image,
    } = ogData.data;

    const baseUrl = getBaseUrl();
    const imageLink = `${baseUrl}${main_image}`;
    const profileImageLink = `${baseUrl}${created_by_image}`;

    const createdByNickName = created_by_name
        ? created_by_name.split(' ')[0].length < 4
            ? created_by_name.split(' ').slice(0, 2).join(' ')
            : created_by_name.split(' ')[0]
        : 'Citizen';

    return (
        <>
            <style
                dangerouslySetInnerHTML={{
                    __html: `
                    body {
                        margin: 0;
                        padding: 0;
                        width: 1200px;
                        height: 630px;
                        overflow: hidden;
                    }
                    .nav-header {
                        display: none !important;
                    }
                `,
                }}
            />
            <div
                style={{
                    width: '1200px',
                    height: '630px',
                    position: 'relative',
                    background: '#F7F2EE',
                    overflow: 'hidden',
                    top: '-65px',
                }}>
                <div
                    style={{
                        width: '1200px',
                        height: '487px',
                        background: '#EF4335',
                    }}>
                    {main_image ? (
                        <img
                            src={imageLink}
                            alt="petition image"
                            width={1241}
                            height={930}
                            style={{
                                width: '100%',
                                height: '487px',
                                objectFit: 'cover',
                            }}
                        />
                    ) : (
                        <>
                            <div
                                style={{
                                    display: 'flex',
                                    position: 'absolute',
                                    top: '203.5px',
                                    left: '880px',
                                }}>
                                <svg
                                    width="253"
                                    height="283"
                                    viewBox="0 0 253 283"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg">
                                    <g clipPath="url(#clip0_3030_35)">
                                        <rect
                                            width="253"
                                            height="283"
                                            fill="#F7F2EE"
                                        />
                                        <path
                                            d="M295.595 -137.945H0.19783C-38.4031 -137.945 -69.6953 -106.706 -69.6953 -68.1695V214.883C-69.6953 253.419 -38.4031 284.659 0.19783 284.659H295.595C334.196 284.659 365.488 253.419 365.488 214.883V-68.1695C365.488 -106.706 334.196 -137.945 295.595 -137.945Z"
                                            fill="#F7F2EE"
                                        />
                                        <path
                                            fillRule="evenodd"
                                            clipRule="evenodd"
                                            d="M207.899 -197.189C373.243 -197.189 385.639 -209.696 385.639 -76.5296C385.639 6.01644 385.177 198.861 385.177 235.947C385.177 248.415 385.177 260.303 381.973 269.519C380.272 272.626 379.019 273.982 374.72 276.101C370.988 277.944 367.77 279.379 364.829 280.499C351.642 285.528 343.835 284.132 318.673 284.659C287.92 285.304 211.209 284.659 185.164 284.659V228.851L209.205 197.952L216.511 167.672L208.823 177.072L114.098 112.247L107.332 112.813L110.445 114.129L152.803 201.428L141.541 202.85L102.242 121.778L74.9706 110.588L72.254 91.1297L99.1035 103.387L123.883 101.28L135.474 79.2942L59.8974 45.1435L4.906 116.236L73.8497 212.461L65.6998 284.659C62.2184 284.659 58.5655 284.659 54.9653 284.659C49.6904 284.659 44.4154 284.593 39.1405 284.659C27.5356 284.804 15.957 284.58 4.85325 284.659C-2.90093 284.659 -10.4177 284.659 -17.5653 284.251C-20.0313 284.119 -22.4578 283.948 -24.8184 283.724C-55.479 280.907 -77.5679 270.453 -77.5679 235.5C-77.5679 185.617 -98.0084 -218.912 -38.6651 -193.002C-70.3544 -201.797 168.337 -197.189 207.899 -197.189ZM220.348 90.1687L177.529 142.382L206.739 162.972L249.558 110.72L220.348 90.1687ZM214.295 80.8082L168.799 136.365L138.099 114.814L183.621 59.2435L214.295 80.8082ZM136.885 99.6213L150.073 74.6073L122.102 61.9687L146.763 31.8598L175.775 52.2659L136.885 99.6213ZM104.181 6.01644L135.962 28.3974L112.093 57.4662L75.4981 40.9438L104.181 6.01644Z"
                                            fill="#EF4335"
                                        />
                                    </g>
                                    <defs>
                                        <clipPath id="clip0_3030_35">
                                            <rect
                                                width="253"
                                                height="283"
                                                fill="#F7F2EE"
                                            />
                                        </clipPath>
                                    </defs>
                                </svg>
                            </div>
                        </>
                    )}
                </div>
                <div
                    style={{
                        display: 'flex',
                        position: 'absolute',
                        top: '515px',
                        left: '42px',
                        width: '1100.29px',
                        height: '64px',
                        flexShrink: 0,
                    }}>
                    {/* profile image */}
                    <img
                        src={profileImageLink}
                        style={{
                            width: '4.125rem',
                            height: '4.125rem',
                            borderRadius: '50%',
                            border: '3px solid #EF4335',
                            background: 'lightgray 50% / cover no-repeat',
                        }}
                        alt="profile image"
                    />
                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            paddingLeft: '1.56rem',
                            paddingTop: '0.5rem',
                            justifyContent: 'center',
                            alignItems: 'flex-start',
                        }}>
                        <div
                            style={{
                                color: '#EF4335',
                                fontSize: '1.5rem',
                                fontFamily: inter.style.fontFamily,
                                fontWeight: '400',
                                marginBottom: '-1rem', // Added negative margin to reduce spacing
                            }}>
                            Citizen #{created_by_id}
                        </div>
                        <div
                            style={{
                                color: '#EF4335',
                                fontSize: '2.25rem',
                                fontFamily: inter.style.fontFamily,
                                fontWeight: '700',
                                letterSpacing: '0.02em',
                                paddingRight: '8px',
                            }}>
                            {createdByNickName}&apos;s দাবি
                        </div>
                    </div>
                </div>
                {/* Counts */}
                <div
                    style={{
                        position: 'absolute',
                        top: '520px',
                        left: '560px',
                        width: '1100.29px',
                        height: '64px',
                        flexShrink: 0,
                    }}>
                    <div
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '48px',
                        }}>
                        {/* Upvotes */}
                        <div
                            style={{
                                display: 'flex',
                                alignItems: 'flex-start',
                                gap: '16px',
                            }}>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="32"
                                height="32"
                                viewBox="0 0 32 32"
                                fill="none">
                                <path
                                    d="M20 13.3333L18.6853 13.1147C18.6536 13.3056 18.6638 13.5011 18.7152 13.6877C18.7667 13.8743 18.8581 14.0475 18.9832 14.1951C19.1083 14.3428 19.2641 14.4615 19.4397 14.5429C19.6152 14.6244 19.8065 14.6666 20 14.6667V13.3333ZM5.33333 13.3333V12C4.97971 12 4.64057 12.1405 4.39052 12.3905C4.14048 12.6406 4 12.9797 4 13.3333H5.33333ZM8 28H23.1467V25.3333H8V28ZM24.7467 12H20V14.6667H24.7467V12ZM21.316 13.552L22.3893 7.10533L19.76 6.66667L18.6853 13.1147L21.316 13.552ZM19.76 4H19.4747V6.66667H19.76V4ZM15.036 6.37467L11.684 11.4067L13.9027 12.8867L17.2573 7.85467L15.036 6.37467ZM10.5733 12H5.33333V14.6667H10.5733V12ZM4 13.3333V24H6.66667V13.3333H4ZM27.0693 24.784L28.6693 16.784L26.056 16.2613L24.456 24.2613L27.0693 24.784ZM11.684 11.4067C11.5622 11.5892 11.3959 11.7389 11.2024 11.8424C11.0089 11.9459 10.7928 12 10.5733 12V14.6667C11.2318 14.6666 11.8801 14.504 12.4607 14.1933C13.0412 13.8825 13.5361 13.4332 13.9013 12.8853L11.684 11.4067ZM22.3893 7.10533C22.453 6.72338 22.4328 6.33214 22.33 5.95881C22.2272 5.58548 22.0443 5.23901 21.7941 4.94349C21.5439 4.64797 21.2323 4.41049 20.8811 4.24755C20.5298 4.08462 20.1472 4.00015 19.76 4V6.66667L22.3893 7.10533ZM24.7467 14.6667C24.944 14.6666 25.1388 14.7103 25.3172 14.7946C25.4956 14.879 25.653 15.0019 25.7781 15.1544C25.9032 15.307 25.9929 15.4854 26.0408 15.6768C26.0886 15.8682 26.0947 16.0679 26.056 16.2613L28.6693 16.784C28.7853 16.2038 28.7711 15.6051 28.6278 15.031C28.4845 14.457 28.2156 13.9219 27.8405 13.4643C27.4654 13.0067 26.9935 12.638 26.4587 12.3848C25.924 12.1316 25.3397 12.0002 24.748 12L24.7467 14.6667ZM23.1467 28C24.0715 28.0001 24.9678 27.6796 25.683 27.0933C26.3982 26.5069 26.8881 25.6909 27.0693 24.784L24.456 24.2613C24.3955 24.5639 24.232 24.8362 23.9932 25.0317C23.7544 25.2271 23.4552 25.3338 23.1467 25.3333V28ZM19.4747 4C18.5967 4.00002 17.7324 4.21677 16.9583 4.63102C16.1842 5.04526 15.523 5.6442 15.036 6.37467L17.2573 7.85467C17.5008 7.48931 17.8293 7.18971 18.2164 6.98247C18.6034 6.77522 19.0356 6.66675 19.4747 6.66667V4ZM8 25.3333C7.64638 25.3333 7.30724 25.1929 7.05719 24.9428C6.80714 24.6928 6.66667 24.3536 6.66667 24H4C4 25.0609 4.42143 26.0783 5.17157 26.8284C5.92172 27.5786 6.93913 28 8 28V25.3333Z"
                                    fill="#EF4335"
                                />
                                <path
                                    d="M10.6666 13.3334V26.6667"
                                    stroke="#EF4335"
                                    strokeWidth="2"
                                />
                            </svg>
                            <div style={{width: '119px'}}>
                                <div
                                    style={{
                                        color: '#4F4F4F',
                                        fontSize: '32px',
                                        fontFamily: inter.style.fontFamily,
                                        fontWeight: '600',
                                        lineHeight: '1.2', // Tighter line height for better spacing
                                    }}>
                                    {petition_upvote_count}
                                </div>
                                <div
                                    style={{
                                        color: '#4e4e4e',
                                        fontSize: '16px',
                                        fontFamily: inter.style.fontFamily,
                                        fontWeight: '500',
                                    }}>
                                    Upvotes
                                </div>
                            </div>
                        </div>
                        {/* Downvotes */}
                        <div
                            style={{
                                display: 'flex',
                                alignItems: 'flex-start',
                                gap: '16px',
                            }}>
                            <svg
                                width="32"
                                height="32"
                                viewBox="0 0 32 32"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg">
                                <path
                                    d="M20 18.6667L18.6853 18.8853C18.6536 18.6944 18.6638 18.4989 18.7152 18.3123C18.7667 18.1257 18.8581 17.9525 18.9832 17.8049C19.1083 17.6572 19.2641 17.5385 19.4397 17.4571C19.6152 17.3756 19.8065 17.3334 20 17.3333V18.6667ZM5.33333 18.6667V20C4.97971 20 4.64057 19.8595 4.39052 19.6095C4.14048 19.3594 4 19.0203 4 18.6667H5.33333ZM8 4H23.1467V6.66667H8V4ZM24.7467 20H20V17.3333H24.7467V20ZM21.316 18.448L22.3893 24.8947L19.76 25.3333L18.6853 18.8853L21.316 18.448ZM19.76 28H19.4747V25.3333H19.76V28ZM15.036 25.6253L11.6827 20.5933L13.9013 19.1133L17.256 24.1453L15.036 25.6253ZM10.5733 20H5.33333V17.3333H10.5733V20ZM4 18.6667V8H6.66667V18.6667H4ZM27.0693 7.216L28.6693 15.216L26.056 15.7387L24.456 7.73867L27.0693 7.216ZM11.6827 20.5933C11.5609 20.4108 11.3959 20.2611 11.2024 20.1576C11.0089 20.0541 10.7928 20 10.5733 20V17.3333C11.2318 17.3334 11.8801 17.496 12.4607 17.8067C13.0412 18.1175 13.5361 18.5668 13.9013 19.1147L11.6827 20.5933ZM22.3893 24.8947C22.453 25.2766 22.4328 25.6679 22.33 26.0412C22.2272 26.4145 22.0443 26.761 21.7941 27.0565C21.5439 27.352 21.2323 27.5895 20.8811 27.7524C20.5298 27.9154 20.1472 27.9999 19.76 28V25.3333L22.3893 24.8947ZM24.7467 17.3333C24.944 17.3334 25.1388 17.2897 25.3172 17.2054C25.4956 17.121 25.653 16.9981 25.7781 16.8456C25.9032 16.693 25.9929 16.5146 26.0408 16.3232C26.0886 16.1318 26.0947 15.9321 26.056 15.7387L28.6693 15.216C28.7853 15.7962 28.7711 16.3949 28.6278 16.969C28.4845 17.543 28.2156 18.0781 27.8405 18.5357C27.4654 18.9933 26.9935 19.362 26.4587 19.6152C25.924 19.8684 25.3397 19.9998 24.748 20L24.7467 17.3333ZM23.1467 4C24.0715 3.99994 24.9678 4.32035 25.683 4.9067C26.3982 5.49305 26.8881 6.30911 27.0693 7.216L24.456 7.73867C24.3955 7.43607 24.232 7.16382 23.9932 6.96834C23.7544 6.77285 23.4552 6.66624 23.1467 6.66667V4ZM19.4747 28C18.5967 28 17.7324 27.7832 16.9583 27.369C16.1842 26.9547 15.523 26.3558 15.036 25.6253L17.256 24.1453C17.4994 24.5107 17.8293 24.8103 18.2164 25.0175C18.6034 25.2248 19.0356 25.3333 19.4747 25.3333V28ZM8 6.66667C7.64638 6.66667 7.30724 6.80714 7.05719 7.05719C6.80714 7.30724 6.66667 7.64638 6.66667 8H4C4 6.93913 4.42143 5.92172 5.17157 5.17157C5.92172 4.42143 6.93913 4 8 4V6.66667Z"
                                    fill="#EF4335"
                                />
                                <path
                                    d="M10.6666 18.6667V5.33337"
                                    stroke="#EF4335"
                                    strokeWidth="2"
                                />
                            </svg>
                            <div style={{width: '119px'}}>
                                <div
                                    style={{
                                        color: '#4F4F4F',
                                        fontSize: '32px',
                                        fontFamily: inter.style.fontFamily,
                                        fontWeight: '600',
                                        lineHeight: '1.2', // Tighter line height for better spacing
                                    }}>
                                    {petition_downvote_count}
                                </div>
                                <div
                                    style={{
                                        color: '#4e4e4e',
                                        fontSize: '16px',
                                        fontFamily: inter.style.fontFamily,
                                        fontWeight: '500',
                                    }}>
                                    Downvotes
                                </div>
                            </div>
                        </div>
                        {/* Comments */}
                        <div
                            style={{
                                display: 'flex',
                                alignItems: 'flex-start',
                                gap: '16px',
                            }}>
                            <svg
                                width="32"
                                height="32"
                                viewBox="0 0 32 32"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg">
                                <path
                                    d="M16 30.6667C15.6464 30.6667 15.3073 30.5262 15.0572 30.2762C14.8072 30.0261 14.6667 29.687 14.6667 29.3334V25.3334H9.33337C8.62613 25.3334 7.94785 25.0524 7.44776 24.5523C6.94766 24.0522 6.66671 23.374 6.66671 22.6667V9.33337C6.66671 8.62613 6.94766 7.94785 7.44776 7.44776C7.94785 6.94766 8.62613 6.66671 9.33337 6.66671H28C28.7073 6.66671 29.3856 6.94766 29.8857 7.44776C30.3858 7.94785 30.6667 8.62613 30.6667 9.33337V22.6667C30.6667 23.374 30.3858 24.0522 29.8857 24.5523C29.3856 25.0524 28.7073 25.3334 28 25.3334H22.5334L17.6 30.28C17.3334 30.5334 17 30.6667 16.6667 30.6667H16ZM17.3334 22.6667V26.7734L21.44 22.6667H28V9.33337H9.33337V22.6667H17.3334ZM4.00004 20H1.33337V4.00004C1.33337 3.2928 1.61433 2.61452 2.11442 2.11442C2.61452 1.61433 3.2928 1.33337 4.00004 1.33337H25.3334V4.00004H4.00004V20Z"
                                    fill="#EF4335"
                                />
                            </svg>
                            <div style={{width: '119px'}}>
                                <div
                                    style={{
                                        color: '#4F4F4F',
                                        fontSize: '32px',
                                        fontFamily: inter.style.fontFamily,
                                        fontWeight: '600',
                                        lineHeight: '1.2', // Tighter line height for better spacing
                                    }}>
                                    {petition_comments_count}
                                </div>
                                <div
                                    style={{
                                        color: '#4e4e4e',
                                        fontSize: '16px',
                                        fontFamily: inter.style.fontFamily,
                                        fontWeight: '500',
                                    }}>
                                    Comments
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {/* Date */}
                {main_image ? (
                    <div
                        style={{
                            display: 'flex',
                            position: 'absolute',
                            top: '52px',
                            left: '60px',
                            color: '#F7F2EE',
                            fontFamily: inter.style.fontFamily,
                            fontSize: '2rem',
                            fontStyle: 'normal',
                            fontWeight: '600',
                            lineHeight: '2rem',
                            textAlign: 'right',
                            whiteSpace: 'nowrap',
                        }}>
                        {created_at}
                    </div>
                ) : (
                    <div
                        style={{
                            display: 'flex',
                            position: 'absolute',
                            top: '52px',
                            left: '60px',
                            color: '#F7F2EE',
                            fontFamily: inter.style.fontFamily,
                            fontSize: '1.3rem',
                            fontWeight: '700',
                            lineHeight: '2rem',
                            textAlign: 'right',
                            whiteSpace: 'nowrap',
                        }}>
                        {created_at}
                    </div>
                )}
                {/* Jonogon Logo */}
                {main_image && (
                    <div
                        style={{
                            display: 'flex',
                            position: 'absolute',
                            top: '35px',
                            left: '883px',
                            width: '57.29px',
                            height: '64px',
                            flexShrink: 0,
                        }}>
                        <svg
                            width="58"
                            height="64"
                            viewBox="0 0 58 64"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg">
                            <path
                                fillRule="evenodd"
                                clipRule="evenodd"
                                d="M34.1875 14.2477C36.3155 11.6358 38.7171 9.03536 41.377 6.56186C50.6432 15.182 57.2903 29.2631 57.2903 36.0902C57.2903 48.3564 50.0351 58.8753 39.7073 63.3362V57.4149L43.7993 51.7289L45.0411 46.1603L43.7332 47.8906L27.6159 35.9551L26.4657 36.0608L26.9945 36.2933L34.202 52.3796L32.2865 52.6411L25.5984 37.7087L20.9603 35.6518L20.4965 32.068L25.0661 34.3248L29.2822 33.9378L31.2533 29.8903L18.3944 23.6048L9.03936 36.679L20.7609 54.3993L19.2676 64C8.05285 59.9966 0 49.013 0 36.0902C0 26.9087 8.91832 11.6845 21.4839 0C26.3791 4.55357 30.7015 9.43523 34.1875 14.2477ZM45.6939 31.8914L38.4087 41.5028L43.3784 45.2911L50.6636 35.675L45.6939 31.8914ZM44.6643 30.1692L36.9175 40.3953L31.6998 36.4269L39.4464 26.2008L44.6643 30.1692ZM31.4933 33.631L33.7312 29.0328L28.9715 26.7063L33.1735 21.1621L38.1026 24.9156L31.4933 33.631ZM25.9184 16.4046L31.3264 20.5218L27.2716 25.8731L21.0485 22.832L25.9184 16.4046Z"
                                fill="#EF4335"
                            />
                        </svg>
                        <div
                            style={{
                                display: 'flex',
                                position: 'absolute',
                                top: '13px',
                                left: '72px',
                            }}>
                            <svg
                                width="192"
                                height="46"
                                viewBox="0 0 192 46"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg">
                                <path
                                    d="M29.16 43.08C26.088 43.08 23.208 42.6747 20.52 41.864C17.832 41.0107 15.336 39.624 13.032 37.704C10.7707 35.784 8.70133 33.1813 6.824 29.896C4.98933 26.6107 3.38933 22.5147 2.024 17.608L10.024 15.368C11.5173 20.5307 13.1387 24.6053 14.888 27.592C16.68 30.536 18.7067 32.6267 20.968 33.864C23.2293 35.1013 25.8107 35.72 28.712 35.72C31.7413 35.72 33.896 35.1867 35.176 34.12C36.4987 33.0107 37.16 31.6027 37.16 29.896C37.16 28.4453 36.9893 27.2507 36.648 26.312C36.3493 25.3733 36.0293 24.584 35.688 23.944L41.576 24.264C40.2533 25.4587 38.9307 26.5253 37.608 27.464C36.2853 28.36 34.8347 29.0853 33.256 29.64C31.72 30.152 29.8853 30.408 27.752 30.408C25.9173 30.408 24.2747 30.1093 22.824 29.512C21.3733 28.9147 20.2213 27.9973 19.368 26.76C18.5573 25.48 18.152 23.8587 18.152 21.896C18.152 20.1893 18.6213 18.5253 19.56 16.904C20.4987 15.24 22.248 13.6613 24.808 12.168C23.9973 12.2107 23.2507 12.232 22.568 12.232C21.928 12.232 21.1813 12.232 20.328 12.232H0.36V5.192H65.448V12.232H46.504C45.352 12.232 44.008 12.2107 42.472 12.168C40.9787 12.0827 39.6773 12.0187 38.568 11.976C36.0507 12.8293 33.896 13.768 32.104 14.792C30.312 15.7733 28.9467 16.7973 28.008 17.864C27.0693 18.888 26.6 19.8907 26.6 20.872C26.6 21.7253 26.8347 22.3653 27.304 22.792C27.7733 23.176 28.328 23.368 28.968 23.368C30.12 23.368 31.144 23.1333 32.04 22.664C32.936 22.1947 33.96 21.5333 35.112 20.68L44.456 23.432C44.7547 24.2853 44.9893 25.2667 45.16 26.376C45.3733 27.4853 45.48 28.6587 45.48 29.896C45.48 32.0293 44.9467 34.12 43.88 36.168C42.8133 38.1733 41.0853 39.8373 38.696 41.16C36.3067 42.44 33.128 43.08 29.16 43.08ZM58.536 32.392C58.536 34.0987 58.7067 35.9333 59.048 37.896C59.432 39.8587 59.9653 41.8853 60.648 43.976L52.392 45.704C51.5813 43.4 50.984 41.1813 50.6 39.048C50.216 36.9147 50.024 34.5467 50.024 31.944C50.024 30.3653 50.1307 28.8293 50.344 27.336C50.6 25.8 50.9627 24.3707 51.432 23.048C48.232 22.5787 45.48 21.8533 43.176 20.872C40.872 19.8907 38.9307 18.696 37.352 17.288C35.816 15.8373 34.536 14.216 33.512 12.424L42.344 11.592C42.856 12.36 43.5813 13.1067 44.52 13.832C45.5013 14.5147 46.76 15.0907 48.296 15.56C49.8747 15.9867 51.816 16.2 54.12 16.2C54.5893 16.2 55.0373 16.1787 55.464 16.136C55.9333 16.0933 56.5093 16.0507 57.192 16.008L61.096 22.344C60.2853 23.7947 59.6453 25.3307 59.176 26.952C58.7493 28.5733 58.536 30.3867 58.536 32.392ZM106.029 5.192V12.232H99.8845V45H91.4365V31.56L92.7165 34.888C91.3938 33.1813 89.9645 31.624 88.4285 30.216C86.8925 28.808 85.3352 27.6773 83.7565 26.824C82.2205 25.9707 80.7058 25.544 79.2125 25.544C78.1458 25.544 77.2285 25.8 76.4605 26.312C75.7352 26.7813 75.3725 27.5493 75.3725 28.616C75.3725 29.5547 75.7138 30.344 76.3965 30.984C77.0792 31.624 78.1672 32.2427 79.6605 32.84L75.8845 39.88C73.0258 38.7707 70.7645 37.192 69.1005 35.144C67.4792 33.0533 66.6685 30.7707 66.6685 28.296C66.6685 25.992 67.2018 24.1147 68.2685 22.664C69.3352 21.1707 70.7005 20.0827 72.3645 19.4C74.0712 18.6747 75.8205 18.312 77.6125 18.312C79.5752 18.312 81.4312 18.6107 83.1805 19.208C84.9298 19.8053 86.5938 20.6587 88.1725 21.768C89.7938 22.8347 91.3725 24.1573 92.9085 25.736L91.6285 26.376C91.5432 25.352 91.4792 24.3067 91.4365 23.24C91.4365 22.1307 91.4365 21.1067 91.4365 20.168V12.232H64.1725V5.192H106.029ZM136.223 45V19.208L137.823 21.96C136.884 20.7227 135.86 19.5067 134.751 18.312C133.684 17.1173 132.532 16.0293 131.295 15.048C130.1 14.0667 128.799 13.2773 127.391 12.68C126.026 12.0827 124.554 11.784 122.975 11.784C120.97 11.784 119.37 12.232 118.175 13.128C116.98 14.024 115.828 15.048 114.719 16.2L113.951 16.072C114.804 15.5173 115.764 15.0693 116.831 14.728C117.898 14.344 119.22 14.152 120.799 14.152C122.719 14.152 124.319 14.5147 125.599 15.24C126.922 15.9653 127.924 16.9467 128.607 18.184C129.29 19.3787 129.631 20.7227 129.631 22.216C129.631 24.776 128.692 27.1227 126.815 29.256C124.98 31.3893 122.164 33.5227 118.367 35.656L113.503 28.808C115.978 27.6987 117.94 26.6107 119.391 25.544C120.884 24.4773 121.631 23.3467 121.631 22.152C121.631 21.4267 121.396 20.872 120.927 20.488C120.5 20.0613 119.754 19.848 118.687 19.848C117.834 19.848 116.959 19.976 116.063 20.232C115.167 20.488 114.164 20.9147 113.055 21.512L106.335 16.136C107.828 13.96 109.386 12.0187 111.007 10.312C112.671 8.60533 114.463 7.26133 116.383 6.28C118.303 5.256 120.394 4.744 122.655 4.744C124.703 4.744 126.602 5.10667 128.351 5.832C130.143 6.55733 131.914 7.624 133.663 9.032C135.412 10.3973 137.29 12.0827 139.295 14.088L136.479 13.32C136.479 12.808 136.436 12.0827 136.351 11.144C136.266 10.1627 136.223 8.968 136.223 7.56V0.967999H143.199L144.607 5.192H150.815V12.232H144.671V45H136.223ZM191.98 5.192V12.232H185.836V45H177.388V17.992L178.86 21.704C177.494 19.9547 176.065 18.3547 174.572 16.904C173.078 15.4107 171.542 14.216 169.964 13.32C168.385 12.424 166.785 11.976 165.164 11.976C164.31 11.976 163.564 12.1467 162.924 12.488C162.284 12.7867 161.772 13.256 161.388 13.896C161.046 14.4933 160.876 15.24 160.876 16.136C160.876 17.032 161.089 17.864 161.516 18.632C161.985 19.3573 162.796 19.9547 163.948 20.424C165.1 20.8507 166.764 21.1067 168.94 21.192L167.98 29.512C164.31 29.0853 161.302 28.2747 158.956 27.08C156.609 25.8427 154.881 24.2853 153.772 22.408C152.705 20.5307 152.172 18.376 152.172 15.944C152.172 13.6827 152.684 11.72 153.708 10.056C154.732 8.34933 156.118 7.048 157.868 6.152C159.66 5.21333 161.644 4.744 163.82 4.744C166.081 4.744 168.086 5.128 169.836 5.896C171.628 6.664 173.249 7.66666 174.7 8.904C176.193 10.1413 177.622 11.4427 178.988 12.808L177.58 12.872C177.537 11.848 177.494 10.7813 177.452 9.672C177.409 8.56267 177.388 7.53867 177.388 6.6V0.967999H184.3L185.772 5.192H191.98Z"
                                    fill="#EF4335"
                                />
                            </svg>
                        </div>
                    </div>
                )}

                {/* Title */}
                {!main_image && (
                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            position: 'absolute',
                            width: '400px',
                            top: '96px',
                            left: '60px',
                            gap: '1.325rem',
                        }}>
                        <div
                            style={{
                                width: '900px',
                                color: '#F7F2EE',
                                fontFamily: inter.style.fontFamily,
                                fontSize: '3rem',
                                fontWeight: '700',
                                lineHeight: '4rem',
                            }}>
                            {title}
                        </div>
                        <div
                            style={{
                                color: '#F7F2EE',
                                opacity: '0.6',
                                fontSize: '2.25rem',
                            }}>
                            To {target}
                        </div>
                    </div>
                )}
                <div
                    style={{
                        position: 'absolute',
                        top: '426px',
                        left: '62px',
                        color: '#F7F2EE',
                        fontSize: '1.5rem',
                        fontWeight: '700',
                        fontFamily: inter.style.fontFamily,
                        lineHeight: '2rem',
                    }}>
                    Vote Now!
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
        </>
    );
}
