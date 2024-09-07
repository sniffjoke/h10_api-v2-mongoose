export interface CommentInstance {
    _id: string;
    content: string;
    commentatorInfo: {
      userId: string,
      userLogin: string
    };
    postId: string;
    createdAt: string;
}
