"use client";

import type { Community } from "~/packages/db/schema/public";
import Button from "./Button";
import { ToggleModal } from "./Modal";
import CreatePostModal from "./modals/CreatePostModal";
import type { AuthenticatedUser } from "@/server/queries/users";

export default function CreatePost(props: {
	user?: AuthenticatedUser;
	communities: Community[];
}) {
	return (
		<>
			<ToggleModal id="create-post">
				<Button>Create Post</Button>
			</ToggleModal>

			<CreatePostModal user={props.user} communities={props.communities} />
		</>
	);
}
