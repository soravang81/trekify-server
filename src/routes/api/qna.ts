import express, { Request, Response, Router } from "express";
import prisma from "../../db/db";

const qna = Router();

qna.get("/", async (req: Request, res: Response) => {
  try {
    const questions = await prisma.qnAQuestions.findMany({
      include: {
        user: true,
        community: true,
        answers: {
          include: {
            user: true,
          },
        },
      },
    });
    res.json({ success: true, questions });
  } catch (error) {
    console.error('Error fetching questions:', error);
    res.status(500).json({ success: false, error: 'Error fetching questions' });
  }
});

// Create a new QnA question
qna.post("/", async (req: Request | any, res: Response) => {
  try {
    const { question, communityId, tags } = req.body;
    const userId = req.userId ?? req.body.userId

    const newQuestion = await prisma.qnAQuestions.create({
      data: {
        question,
        userId,
        communityId,
        tags,
      },
    });

    res.json({ success: true, question: newQuestion });
  } catch (error) {
    console.error('Error creating QnA question:', error);
    res.status(500).json({ success: false, error: "Error creating QnA question" });
  }
});

// Add an answer to a question
qna.post("/:questionId/answer", async (req: Request | any, res: Response) => {
  try {
    const { questionId } = req.params;
    const { answer } = req.body;
    const userId = req.userId ?? req.body.userId

    const question = await prisma.qnAQuestions.findUnique({
      where: { id: questionId },
    });

    if (!question) {
      return res.status(404).json({ success: false, error: "Question not found" });
    }

    const newAnswer = await prisma.qnAAnswers.create({
      data: {
        answer,
        userId,
        questionId,
        communityId: question.communityId,
      },
    });

    res.json({ success: true, answer: newAnswer });
  } catch (error) {
    res.status(500).json({ success: false, error: "Error adding answer" });
  }
});

// Remove the question upvote and downvote routes

// Add upvote an answer route
qna.post("/answer/:answerId/upvote", async (req: Request, res: Response) => {
  try {
    const { answerId } = req.params;

    const updatedAnswer = await prisma.qnAAnswers.update({
      where: { id: answerId },
      data: {
        upvotes: {
          increment: 1,
        },
      },
    });
    res.json({ success: true, answer: updatedAnswer });
  } catch (error) {
    res.status(500).json({ success: false, error: "Error upvoting answer" });
  }
});

// Add downvote an answer route
qna.post("/answer/:answerId/downvote", async (req: Request, res: Response) => {
  try {
    const { answerId } = req.params;

    const updatedAnswer = await prisma.qnAAnswers.update({
      where: { id: answerId },
      data: {
        downvotes: {
          increment: 1,
        },
      },
    });

    res.json({ success: true, answer: updatedAnswer });
  } catch (error) {
    res.status(500).json({ success: false, error: "Error downvoting answer" });
  }
});

export default qna;
