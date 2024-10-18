import express, { Request, Router } from 'express';
import prisma from '../../db/db';

const buddy = Router()

// Create a new travel buddy profile
buddy.post('/', async (req: Request | any, res) => {
  try {
    const { destination, gender, budget, travelStyle, bio, userId } = req.body;

    const travelBuddy = await prisma.travelBuddy.create({
      data: {
        userId: req.userId ?? userId,
        destination,
        gender,
        budget: parseInt(budget),
        travelStyle,
        bio,
      },
    });

    res.status(201).json({ success: true, data: travelBuddy });
  } catch (error) {
    console.error('Failed to create travel buddy profile:', error);
    res.status(500).json({ success: false, error: 'Failed to create travel buddy profile' });
  }
});
buddy.get('/:userId', async (req: Request | any, res) => {
  try {
    const userId = req.userId ?? req.params.userId;

    const travelBuddies = await prisma.travelBuddy.findMany({
      where: {
        userId: {
          not: userId,
        },
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    res.json({ success: true, data: travelBuddies });
  } catch (error) {
    console.error('Failed to fetch travel buddy profiles:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch travel buddy profiles' });
  }
});
// Get all travel buddy profiles (excluding the current user's)
buddy.get('/:userId', async (req: Request | any, res) => {
  try {
    const userId = req.userId ?? req.params.userId;

    const travelBuddies = await prisma.travelBuddy.findMany({
      where: {
        userId: {
          not: userId,
        },
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    res.json({ success: true, data: travelBuddies });
  } catch (error) {
    console.error('Failed to fetch travel buddy profiles:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch travel buddy profiles' });
  }
});

// Send a travel buddy request
buddy.post('/request/:id', async (req: Request | any, res) => {
  try {
    const { receiverId } = req.body;
    const senderId = req.userId ?? req.params.id;

    // Check if both sender and receiver exist in TravelBuddy table
    const [senderBuddy, receiverBuddy] = await Promise.all([
      prisma.travelBuddy.findUnique({ where: { id: senderId } }),
      prisma.travelBuddy.findUnique({ where: { id: receiverId } })
    ]);

    if (!senderBuddy || !receiverBuddy) {
      console.log("senderBuddy", senderBuddy)
      console.log("receiverBuddy", receiverBuddy)
      return res.status(400).json({ 
        success: false, 
        error: 'Both sender and receiver must have a travel buddy profile' 
      });
    }

    const request = await prisma.travelBuddyRequest.create({
      data: {
        senderId: senderBuddy.id,
        receiverId: receiverBuddy.id,
      },
    });

    console.log("request", request)
    res.status(201).json({ success: true, data: request });
  } catch (error) {
    console.error('Failed to send travel buddy request:', error);
    res.status(500).json({ success: false, error: 'Failed to send travel buddy request' });
  }
});

// Get all pending requests for the current user
buddy.get('/requests/:id', async (req: Request | any, res) => {
  try {
    const userId = req.userId ?? req.params.id;

    const requests = await prisma.buddyRequest.findMany({
      where: {
        receiverId: userId,
        status: 'PENDING',
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
      },
    });

    const transformedRequests = requests.map(request => ({
      id: request.id,
      sender: {
        id: request.sender.id,
        name: request.sender.name,
        email: request.sender.email,
        image: request.sender.image,
      },
      status: request.status,
      createdAt: request.createdAt,
      updatedAt: request.updatedAt,
    }));

    res.json({ success: true, data: transformedRequests });
  } catch (error) {
    console.error('Failed to fetch buddy requests:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch buddy requests' });
  }
});

// Accept or reject a travel buddy request
// buddy.put('/request/:requestId', async (req: Request | any, res) => {
//   try {
//     const { requestId } = req.params;
//     const { status, userId } = req.body;
//     console.log("status", status)
//     console.log("userId", userId)

//     if (status !== 'accepted' && status !== 'rejected') {
//       return res.status(400).json({ success: false, error: 'Invalid status' });
//     }

//     // Find the TravelBuddy profile for this user
//     const travelBuddy = await prisma.travelBuddy.findFirst({
//       where: { userId: req.userId ?? userId }
//     });

//     if (!travelBuddy) {
//       return res.status(404).json({ success: false, error: 'Travel buddy profile not found' });
//     }

//     const request = await prisma.travelBuddyRequest.findUnique({
//       where: { id: requestId },
//     });

//     if (!request || request.receiverId !== travelBuddy.id) {
//       return res.status(403).json({ success: false, error: 'Unauthorized' });
//     }

//     const updatedRequest = await prisma.travelBuddyRequest.update({
//       where: { id: requestId },
//       data: { status },
//     });

//     res.json({ success: true, data: updatedRequest });
//   } catch (error) {
//     console.error('Failed to update travel buddy request:', error);
//     res.status(500).json({ success: false, error: 'Failed to update travel buddy request' });
//   }
// });

// Create a new buddy request
buddy.post('/request', async (req, res) => {
  try {
    const { senderId, receiverId } = req.body;
    
    // Create a new buddy request
    const newRequest = await prisma.buddyRequest.create({
      data: {
        senderId,
        receiverId,
        status: 'PENDING'
      }
    });

    res.json({ success: true, data: newRequest });
  } catch (error) {
    console.error('Failed to create buddy request:', error);
    res.status(500).json({ success: false, error: 'Failed to create buddy request' });
  }
});

// Update a buddy request
buddy.put('/request/:requestId', async (req : Request | any, res) => {
  try {
    const { requestId } = req.params;
    const { action, userId } = req.body;
    console.log("action", action)
    console.log("userId", userId)

    // Validate action
    if (action !== 'accept' && action !== 'reject') {
      return res.status(400).json({ success: false, error: 'Invalid action' });
    }

    // Find the request
    const request = await prisma.buddyRequest.findUnique({
      where: { id: requestId }
    });

    if (!request) {
      return res.status(404).json({ success: false, error: 'Request not found' });
    }

    // Check if the user is the receiver of the request
    if (request.receiverId !== userId) {
      return res.status(403).json({ success: false, error: 'Unauthorized to update this request' });
    }

    // Update the buddy request
    const updatedRequest = await prisma.buddyRequest.update({
      where: { id: requestId },
      data: { 
        status: action === 'accept' ? 'ACCEPTED' : 'REJECTED',
        updatedAt: new Date()
      }
    });

    // If accepted, create buddy relationships
    if (action === 'accept') {
      await prisma.buddy.createMany({
        data: [
          { userId: request.senderId, buddyId: request.receiverId },
          { userId: request.receiverId, buddyId: request.senderId }
        ],
        skipDuplicates: true
      });
    }

    res.json({ success: true, data: updatedRequest });
  } catch (error) {
    console.error('Failed to update buddy request:', error);
    res.status(500).json({ success: false, error: 'Failed to update buddy request' });
  }
});

export default buddy;
