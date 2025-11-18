import { prisma } from "../../config/db";

interface CreateCommentInput {
  content: string;
}

// 댓글 작성
export const createComment = async (
  userId: number,
  bookLogId: number,
  data: CreateCommentInput
) => {
  return prisma.comment.create({
    data: {
      userId,
      bookLogId,
      content: data.content,
    },
    include: {
      user: { select: { id: true, name: true } },
    },
  });
};

// 로그 댓글 목록 조회
export const getCommentByLog = async (bookLogId: number) => {
  return prisma.comment.findMany({
    where: { bookLogId },
    orderBy: { createdAt: "desc" },
    include: { user: { select: { id: true, name: true } } },
  });
};

// 댓글 수정
export const updateComment = async (
  commentId: number,
  userId: number,
  content: string
) => {
  const comment = await prisma.comment.findUnique({
    where: { id: commentId },
  });

  if (!comment) throw new Error("댓글을 찾을 수 없습니다.");
  if (comment.userId !== userId) throw new Error("수정 권한이 없습니다.");

  return prisma.comment.update({
    where: { id: commentId },
    data: { content },
  });
};

// 댓글 삭제
export const deleteComment = async (commentId: number, userId: number) => {
  const comment = await prisma.comment.findUnique({
    where: { id: commentId },
  });
  if (!comment) throw new Error("댓글을 찾을 수 없습니다.");
  if (comment.userId !== userId) throw new Error("삭제 권한이 없습니다.");

  return prisma.comment.delete({
    where: { id: commentId },
  });
};
