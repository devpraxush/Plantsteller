import { Router, Response } from 'express';
import { CommunityPost } from '../models/CommunityPost.js';
import { verifyToken, AuthRequest } from '../middleware/auth.js';

const router = Router();

// Get all posts
router.get('/posts', async (req: AuthRequest, res: Response) => {
  try {
    const { category, tag, search, page = 1, limit = 20 } = req.query;

    const filters: any = {};
    if (category) filters.category = category;
    if (tag) filters.tags = tag;
    if (search) {
      filters.$or = [
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } },
      ];
    }

    const skip = (Number(page) - 1) * Number(limit);
    const posts = await CommunityPost.find(filters)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    const total = await CommunityPost.countDocuments(filters);

    res.json({
      success: true,
      data: {
        posts,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
          pages: Math.ceil(total / Number(limit)),
        },
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch posts',
      code: 'FETCH_POSTS_ERROR',
    });
  }
});

// Get post by ID
router.get('/posts/:id', async (req: AuthRequest, res: Response) => {
  try {
    const post = await CommunityPost.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        error: 'Post not found',
        code: 'POST_NOT_FOUND',
      });
    }

    res.json({ success: true, data: post });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch post',
      code: 'FETCH_POST_ERROR',
    });
  }
});

// Create post
router.post('/posts', verifyToken, async (req: AuthRequest, res: Response) => {
  try {
    const { title, content, category, tags } = req.body;

    const post = new CommunityPost({
      userId: req.user?.id,
      userName: req.body.userName,
      title,
      content,
      category,
      tags,
    });

    await post.save();
    res.status(201).json({ success: true, data: post });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: 'Failed to create post',
      code: 'CREATE_POST_ERROR',
    });
  }
});

// Add comment to post
router.post('/posts/:id/comments', verifyToken, async (req: AuthRequest, res: Response) => {
  try {
    const { content } = req.body;

    const post = await CommunityPost.findByIdAndUpdate(
      req.params.id,
      {
        $push: {
          comments: {
            userId: req.user?.id,
            userName: req.body.userName,
            content,
            createdAt: new Date(),
          },
        },
      },
      { new: true }
    );

    if (!post) {
      return res.status(404).json({
        success: false,
        error: 'Post not found',
        code: 'POST_NOT_FOUND',
      });
    }

    res.status(201).json({ success: true, data: post });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: 'Failed to add comment',
      code: 'ADD_COMMENT_ERROR',
    });
  }
});

// Upvote post
router.post('/posts/:id/upvote', verifyToken, async (req: AuthRequest, res: Response) => {
  try {
    const post = await CommunityPost.findByIdAndUpdate(
      req.params.id,
      { $inc: { upvotes: 1 } },
      { new: true }
    );

    if (!post) {
      return res.status(404).json({
        success: false,
        error: 'Post not found',
        code: 'POST_NOT_FOUND',
      });
    }

    res.json({ success: true, data: post });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to upvote post',
      code: 'UPVOTE_ERROR',
    });
  }
});

// Get expert advice
router.get('/expert-advice', async (req: AuthRequest, res: Response) => {
  try {
    const expertPosts = await CommunityPost.find({
      category: 'care-guide',
    })
      .sort({ upvotes: -1 })
      .limit(10);

    res.json({
      success: true,
      data: expertPosts,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch expert advice',
      code: 'FETCH_EXPERT_ADVICE_ERROR',
    });
  }
});

export default router;
