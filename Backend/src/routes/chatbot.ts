import { Router, Response } from 'express';
import { ChatMessage } from '../models/ChatMessage.js';
import { verifyToken, AuthRequest } from '../middleware/auth.js';

const router = Router();

// Send chat message
router.post('/message', verifyToken, async (req: AuthRequest, res: Response) => {
  try {
    const { message, type = 'text', plantContext } = req.body;

    // TODO: Integrate OpenAI for actual responses
    const mockResponse = generateMockResponse(message, type);

    const chatMessage = new ChatMessage({
      userId: req.user?.id,
      message,
      response: mockResponse,
      type,
      plantContext,
    });

    await chatMessage.save();

    res.status(201).json({
      success: true,
      data: {
        id: chatMessage._id,
        message: chatMessage.message,
        response: chatMessage.response,
        type: chatMessage.type,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to process message',
      code: 'MESSAGE_ERROR',
    });
  }
});

// Get chat history
router.get('/history', verifyToken, async (req: AuthRequest, res: Response) => {
  try {
    const { limit = 50 } = req.query;

    const messages = await ChatMessage.find({ userId: req.user?.id })
      .sort({ createdAt: -1 })
      .limit(Number(limit));

    res.json({
      success: true,
      data: messages.reverse(),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch chat history',
      code: 'FETCH_HISTORY_ERROR',
    });
  }
});

// Get care recommendation
router.post('/care-recommendation', verifyToken, async (req: AuthRequest, res: Response) => {
  try {
    const { plantName } = req.body;

    // TODO: Integrate with plant care database
    const mockRecommendation = generateCareTip(plantName);

    const chatMessage = new ChatMessage({
      userId: req.user?.id,
      message: `Tell me about caring for ${plantName}`,
      response: mockRecommendation,
      type: 'care-tip',
      plantContext: {
        plantName,
      },
    });

    await chatMessage.save();

    res.status(201).json({
      success: true,
      data: {
        plant: plantName,
        recommendation: mockRecommendation,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to get recommendation',
      code: 'RECOMMENDATION_ERROR',
    });
  }
});

// Mock response generators
const generateMockResponse = (message: string, type: string): string => {
  const responses: { [key: string]: string[] } = {
    care: [
      'Water your plant when the top inch of soil feels dry. Most plants prefer moist but not soggy soil.',
      'Place your plant in bright, indirect light. Most plants appreciate 6-8 hours of light daily.',
      'Keep your plant at a comfortable room temperature between 65-75°F (18-24°C).',
    ],
    pest: [
      'Common pests include spider mites and mealybugs. Neem oil is an effective natural treatment.',
      'Check the undersides of leaves regularly for pest infestations.',
    ],
    watering: [
      'Most tropical plants need water when the top 1-2 inches of soil are dry.',
      'During winter, reduce watering frequency as plants grow slower.',
    ],
  };

  const keywords = message.toLowerCase();
  for (const [key, responseList] of Object.entries(responses)) {
    if (keywords.includes(key)) {
      return responseList[Math.floor(Math.random() * responseList.length)];
    }
  }

  return 'Great question! I recommend checking our care guides or consulting with our community of plant experts.';
};

const generateCareTip = (plantName: string): string => {
  return `${plantName} Care Guide:
- Watering: Water when soil is dry to touch, usually every 7-10 days
- Light: Bright, indirect light preferred; avoid direct sunlight
- Temperature: Keep between 65-75°F (18-24°C)
- Humidity: Moderate to high humidity preferred
- Soil: Use well-draining potting soil
- Fertilizer: Feed every 4 weeks during growing season`;
};

export default router;
