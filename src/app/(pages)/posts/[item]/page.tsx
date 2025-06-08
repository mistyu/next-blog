import type { Metadata, ResolvingMetadata } from 'next';
import type { FC } from 'react';

import { MdxRender } from '@/app/_components/mdx/render';
import { PostEditButton } from '@/app/_components/post/edit-button';
import { queryPostItem } from '@/app/actions/post';
import { formatChineseTime } from '@/libs/time';
import { isNil } from 'lodash';
import { Calendar } from 'lucide-react';
import Image from 'next/image';
import { notFound } from 'next/navigation';

import $styles from './page.module.css';

export const generateMetadata = async (
    { params }: { params: Promise<{ item: string }> },
    parent: ResolvingMetadata,
): Promise<Metadata> => {
    const { item } = await params;
    const post = await queryPostItem(item);

    if (isNil(post)) return {};

    return {
        title: `${post.title} - ${(await parent).title?.absolute}`,
        keywords: post.keywords,
        description: post.description,
    };
};

const PostItemPage: FC<{ params: Promise<{ item: string }> }> = async ({ params }) => {
    const { item } = await params;
    const post = await queryPostItem(item);
    if (isNil(post)) return notFound();

    return (
        <div className="tw-page-container">
            <div className={$styles.item}>
                <div className={$styles.thumb}>
                    <Image
                        src={post.thumb}
                        alt={post.title}
                        fill
                        priority
                        sizes="100%"
                        unoptimized
                    />
                </div>

                <div className={$styles.content}>
                    <MdxRender
                        source={post.body}
                        header={
                            <>
                                <header className={$styles.title}>
                                    <h1 className="tw-text-lg lg:tw-text-3xl">{post.title}</h1>
                                    <div className="tw-ml-2">
                                        <PostEditButton id={post.id} iconBtn />
                                    </div>
                                </header>
                                <div className={$styles.meta}>
                                    <div>
                                        <span>
                                            <Calendar />
                                        </span>
                                        <time className="tw-ellips">
                                            {!isNil(post.updatedAt)
                                                ? formatChineseTime(new Date(post.updatedAt))
                                                : formatChineseTime(new Date(post.createdAt))}
                                        </time>
                                    </div>
                                </div>
                            </>
                        }
                    />
                </div>
            </div>
        </div>
    );
};

export default PostItemPage;
