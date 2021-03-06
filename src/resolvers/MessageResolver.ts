import { Message } from "../entity/Message";
import { Arg, Ctx, Mutation, Query, Resolver } from "type-graphql";

@Resolver()
export class MessageResolver {
	@Query(() => [Message])
	messages() {
		return Message.find();
	}

	@Query(() => Message, { nullable: true })
	async getMessage(@Arg("id") id: number) {
		try {
			const message = await Message.findOne({ where: { id } });

			if (!message) {
				return null;
			}

			return message;
		} catch (err) {
			console.log(err);
			return null;
		}
	}

	@Mutation(() => Message, { nullable: true })
	async createMessage(
		@Arg("content") content: string,
		@Arg("conversation") conversation: number,
		@Ctx() { req }: any
	) {
		try {
			const userId = req.session.userId;
			if (!userId) {
				return null;
			}
			const message = await Message.create({
				content,
				authorId: userId,
				conversation,
			});

			await message.save();

			return message;
		} catch (err) {
			console.log(err);
			return null;
		}
	}

	@Mutation(() => Boolean)
	async deleteMessage(@Arg("id") id: number) {
		try {
			const message = await Message.findOne({ where: { id } });

			if (!message) {
				return false;
			}

			await message.remove();

			return true;
		} catch (err) {
			console.log(err);
			return false;
		}
	}

	@Mutation(() => Message, { nullable: true })
	async updateMessage(
		@Arg("id") id: number,
		@Arg("content", { nullable: true }) content: string
	) {
		try {
			const message = await Message.findOne({ where: { id } });

			if (!message) {
				return null;
			}

			if (content) {
				message.content = content;
			}

			message.updatedAt = new Date();

			Message.update(id, message);

			return message;
		} catch (err) {
			console.log(err);
			return null;
		}
	}
}
