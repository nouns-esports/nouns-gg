"use client";

import type { getPosts } from "@/server/queries/posts";
import PostCard from "./PostCard";
import CreatePost from "./CreatePost";
import type { getRounds } from "@/server/queries/rounds";
import type { getAuthenticatedUser } from "@/server/queries/users";
import { useState } from "react";
import RoundCard from "./RoundCard";
import type { getQuests } from "@/server/queries/quests";
import type { getPredictions } from "@/server/queries/predictions";
import type { getEvents } from "@/server/queries/events";
import QuestCard from "./QuestCard";
import PredictionCard from "./PredictionCard";
import EventCard from "./EventCard";

export default function Feed(props: {
	user: Awaited<ReturnType<typeof getAuthenticatedUser>>;
	posts: NonNullable<Awaited<ReturnType<typeof getPosts>>>;
	// rounds: NonNullable<Awaited<ReturnType<typeof getRounds>>>;
	// quests: NonNullable<Awaited<ReturnType<typeof getQuests>>>;
	// predictions: NonNullable<Awaited<ReturnType<typeof getPredictions>>>;
	// events: NonNullable<Awaited<ReturnType<typeof getEvents>>>;
}) {
	// const [selected, setSelected] = useState<
	// 	"posts" | "rounds" | "quests" | "predictions" | "events" | "all"
	// >("all");

	// type PostItem = { itemType: "post" } & NonNullable<
	// 	Awaited<ReturnType<typeof getPosts>>
	// >[number];
	// type RoundItem = { itemType: "round" } & NonNullable<
	// 	Awaited<ReturnType<typeof getRounds>>
	// >[number];
	// type QuestItem = { itemType: "quest" } & NonNullable<
	// 	Awaited<ReturnType<typeof getQuests>>
	// >[number];
	// type PredictionItem = { itemType: "prediction" } & NonNullable<
	// 	Awaited<ReturnType<typeof getPredictions>>
	// >[number];
	// type EventItem = { itemType: "event" } & NonNullable<
	// 	Awaited<ReturnType<typeof getEvents>>
	// >[number];
	// type FeedItem = PostItem | RoundItem | QuestItem | PredictionItem | EventItem;

	// const items: FeedItem[] =
	// 	selected === "all"
	// 		? [
	// 				...props.posts.map((post) => ({
	// 					itemType: "post" as const,
	// 					...post,
	// 				})),
	// 				...props.rounds.map((round) => ({
	// 					itemType: "round" as const,
	// 					...round,
	// 				})),
	// 				...props.quests.map((quest) => ({
	// 					itemType: "quest" as const,
	// 					...quest,
	// 				})),
	// 				...props.predictions.map((prediction) => ({
	// 					itemType: "prediction" as const,
	// 					...prediction,
	// 				})),
	// 				...props.events.map((event) => ({
	// 					itemType: "event" as const,
	// 					...event,
	// 				})),
	// 			]
	// 		: selected === "posts"
	// 			? props.posts.map((post) => ({ itemType: "post" as const, ...post }))
	// 			: selected === "rounds"
	// 				? props.rounds.map((round) => ({
	// 						itemType: "round" as const,
	// 						...round,
	// 					}))
	// 				: selected === "quests"
	// 					? props.quests.map((quest) => ({
	// 							itemType: "quest" as const,
	// 							...quest,
	// 						}))
	// 					: selected === "predictions"
	// 						? props.predictions.map((prediction) => ({
	// 								itemType: "prediction" as const,
	// 								...prediction,
	// 							}))
	// 						: selected === "events"
	// 							? props.events.map((event) => ({
	// 									itemType: "event" as const,
	// 									...event,
	// 								}))
	// 							: [];

	return (
		<div className="flex flex-col gap-4 max-w-3xl">
			<div className="flex items-center justify-between">
				{/* <h2 className="text-white text-3xl leading-none font-luckiest-guy">
					Activity
				</h2> */}
				{/* <select
					className="bg-grey-600 hover:bg-grey-500 transition-colors rounded-lg p-2 outline-none appearance-none"
					value={selected}
					onChange={(e) =>
						setSelected(e.target.value as "posts" | "rounds" | "all")
					}
				>
					<option value="all">All</option>
					<option value="posts">Posts</option>
					<option value="rounds">Rounds</option>
					<option value="quests">Quests</option>
					<option value="predictions">Predictions</option>
					<option value="events">Events</option>
				</select> */}
				{/* <CreatePost user={props.user} communities={[]} /> */}
			</div>
			{props.posts.map((post) => (
				<PostCard key={post.hash} post={post} />
			))}
			{/* {items.map((item) => {
				if (item.itemType === "post") {
					return <PostCard key={item.hash} post={item} />;
				}

				if (item.itemType === "round") {
					return <RoundCard key={item.id} round={item} />;
				}

				if (item.itemType === "quest") {
					return <QuestCard key={item.id} quest={item} />;
				}

				if (item.itemType === "prediction") {
					return <PredictionCard key={item.id} prediction={item} />;
				}

				if (item.itemType === "event") {
					return <EventCard key={item.id} event={item} />;
				}
			})} */}
		</div>
	);
}
