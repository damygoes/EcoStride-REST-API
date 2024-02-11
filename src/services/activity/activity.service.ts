import { Request, Response } from "express";
import mongoose from "mongoose";
import slugify from "slugify";

import { ActivityDocument } from "../../interfaces/activityDocument";
import { MatchQuery } from "../../interfaces/matchQuery";
import { projectActivityDetails } from "../../interfaces/projectActivityDetails";
import { ActivityModel } from "../../models/Activity";
import { AddressModel } from "../../models/Address";
import { BucketListModel } from "../../models/BucketList";
import { DoneActivityModel } from "../../models/DoneActivity";
import { EndCoordinateModel } from "../../models/EndCoordinate";
import { StartCoordinateModel } from "../../models/StartCoordinate";
import { UserModel } from "../../models/User";
import { activityValidationSchema } from "../../validations/activityValidator";

interface CustomRequest extends Request {
  user?: {
    userId: string;
  };
}

export const getActivities = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { city, state, country, category } = req.query as {
    city?: string;
    state?: string;
    country?: string;
    category?: string;
  };

  let matchStage: { $match: MatchQuery } = { $match: {} };

  // Dynamically add filters to the $match stage and dynamically create indexes
  if (city) matchStage.$match["addressDetails.city"] = city;
  if (state) matchStage.$match["addressDetails.state"] = state;
  if (country) matchStage.$match["addressDetails.country"] = country;
  if (category) matchStage.$match["climbCategory"] = category;

  let pipeline: any[] = [
    {
      $lookup: {
        from: "addresses",
        localField: "address",
        foreignField: "_id",
        as: "addressDetails",
      },
    },
    {
      $unwind: "$addressDetails",
    },
    {
      $lookup: {
        from: "startcoordinates",
        localField: "startCoordinate",
        foreignField: "_id",
        as: "startCoordinateDetails",
      },
    },
    {
      $lookup: {
        from: "endcoordinates",
        localField: "endCoordinate",
        foreignField: "_id",
        as: "endCoordinateDetails",
      },
    },
    {
      $unwind: {
        path: "$startCoordinateDetails",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $unwind: {
        path: "$endCoordinateDetails",
        preserveNullAndEmptyArrays: true,
      },
    },
    matchStage,
    projectActivityDetails,
  ];

  try {
    const activities: ActivityDocument[] = await ActivityModel.aggregate(
      pipeline
    ); // Use ActivityDocument if you defined it
    return res.json(activities);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const getActivity = async (
  req: Request,
  res: Response
): Promise<Response<any, Record<string, any>>> => {
  const { slug } = req.params;

  try {
    const pipeline: any[] = [
      {
        $match: { slug: slug },
      },
      {
        $lookup: {
          from: "addresses",
          localField: "address",
          foreignField: "_id",
          as: "addressDetails",
        },
      },
      {
        $unwind: "$addressDetails",
      },
      projectActivityDetails,
    ];

    const activities = await ActivityModel.aggregate(pipeline);

    if (activities.length === 0) {
      return res.status(404).json({ message: "Activity not found" });
    } else {
      res.json(activities[0]); // Since slug should be unique, assuming only one result.
    }
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({ message: "Invalid activity slug format" });
    }
    res.status(500).json({ error: error.message });
  }
};

export const getUsersCreatedActivities = async (
  req: CustomRequest,
  res: Response
): Promise<void> => {
  const userIdFromToken = req.user?.userId;

  if (!userIdFromToken) {
    res.status(403).json({ message: "User ID not found in token" });
    return;
  }

  // Retrieve user role along with the user ID from the token
  const user = await UserModel.findById(userIdFromToken);
  if (!user) {
    res.status(404).json({ message: "User not found" });
    return;
  }
  const isUserAdmin = user.role === "ADMIN";

  let query = {};

  // If the user is not an admin, modify the query to fetch only their activities
  if (!isUserAdmin) {
    query = { createdBy: userIdFromToken };
  }

  try {
    const activities = await ActivityModel.find(query);
    res.json(activities);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getUsersBucketListActivities = async (
  req: CustomRequest,
  res: Response
): Promise<Response<any, Record<string, any>>> => {
  const userIdFromToken = req.user?.userId;

  if (!userIdFromToken) {
    res.status(403).json({ message: "User ID not found in token" });
    return;
  }

  // Retrieve user role along with the user ID from the token
  const user = await UserModel.findById(userIdFromToken);
  if (!user) {
    res.status(404).json({ message: "User not found" });
    return;
  }
  const isUserAdmin = user.role === "ADMIN";

  let query = {};

  // If the user is not an admin, modify the query to fetch only their activities
  if (!isUserAdmin) {
    query = { userId: userIdFromToken };
  }

  try {
    // Find bucket list items for the user
    const bucketListItems = await BucketListModel.find(query).lean(); // Using lean() for performance, as we're not modifying the bucket list items here
    if (bucketListItems.length === 0) {
      return res
        .status(404)
        .json({ message: "No bucket list items found for the user" });
    }

    // Extract activityIds from the bucket list items
    const activityIds = bucketListItems.map((item) => item.activityId);

    // Find and populate the activities in a single query
    const activities = await ActivityModel.find({ _id: { $in: activityIds } })
      .populate("address")
      .populate("startCoordinate")
      .populate("endCoordinate")
      .lean(); // Using lean() for performance, as we're not modifying the activities here

    // Return the populated activities
    res.json(activities);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getUsersDoneActivities = async (
  req: CustomRequest,
  res: Response
): Promise<Response<any, Record<string, any>>> => {
  const userIdFromToken = req.user?.userId;

  if (!userIdFromToken) {
    res.status(403).json({ message: "User ID not found in token" });
    return;
  }

  // Retrieve user role along with the user ID from the token
  const user = await UserModel.findById(userIdFromToken);
  if (!user) {
    res.status(404).json({ message: "User not found" });
    return;
  }
  const isUserAdmin = user.role === "ADMIN";

  let query = {};

  // If the user is not an admin, modify the query to fetch only their activities
  if (!isUserAdmin) {
    query = { userId: userIdFromToken };
  }

  try {
    const doneActivities = await DoneActivityModel.find(query).lean();

    if (doneActivities.length === 0) {
      return res
        .status(404)
        .json({ message: "No done activities found for the user" });
    }

    const activityIds = doneActivities.map((item) => item.activityId);

    const activities = await ActivityModel.find({ _id: { $in: activityIds } })
      .populate("address")
      .populate("startCoordinate")
      .populate("endCoordinate")
      .lean();

    res.json(activities);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const createActivity = async (req: CustomRequest, res: Response) => {
  const userId = req.user?.userId;
  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    const validationResult = activityValidationSchema.validate(req.body);
    if (validationResult.error) {
      throw new Error(validationResult.error.message);
    }

    const user = await UserModel.findById(userId).session(session);
    if (!user) {
      throw new Error("User not found");
    }
    const isUserAdmin = user.role === "ADMIN";

    // Prepare data for creating the activity
    const activityData = {
      ...validationResult.value,
      slug: slugify(validationResult.value.name, { lower: true, strict: true }),
      createdBy: userId,
      isCreatedByAdmin: isUserAdmin,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Directly use the IDs for address, startCoordinate, and endCoordinate if they exist
    if (validationResult.value.address) {
      const addressDoc = await AddressModel.create(
        [{ ...validationResult.value.address }],
        { session }
      );
      activityData.address = addressDoc[0]._id;
    }
    if (validationResult.value.startCoordinate) {
      const startCoordinateDoc = await StartCoordinateModel.create(
        [{ ...validationResult.value.startCoordinate }],
        { session }
      );
      activityData.startCoordinate = startCoordinateDoc[0]._id;
    }
    if (validationResult.value.endCoordinate) {
      const endCoordinateDoc = await EndCoordinateModel.create(
        [{ ...validationResult.value.endCoordinate }],
        { session }
      );
      activityData.endCoordinate = endCoordinateDoc[0]._id;
    }

    // Create the activity with prepared data
    const activity = await ActivityModel.create([activityData], { session });

    // Link the activity ID back to address and coordinates if they were created
    if (activityData.address) {
      await AddressModel.findByIdAndUpdate(
        activityData.address,
        { activityId: activity[0]._id },
        { session }
      );
    }
    if (activityData.startCoordinate) {
      await StartCoordinateModel.findByIdAndUpdate(
        activityData.startCoordinate,
        { activityId: activity[0]._id },
        { session }
      );
    }
    if (activityData.endCoordinate) {
      await EndCoordinateModel.findByIdAndUpdate(
        activityData.endCoordinate,
        { activityId: activity[0]._id },
        { session }
      );
    }

    await session.commitTransaction();
    res.status(201).json(activity[0]);
  } catch (error) {
    await session.abortTransaction();
    res.status(500).json({ error: error.message });
  } finally {
    session.endSession();
  }
};

/**
 * EXPLANATION OF CODE on createActivity
 * 
 * In Mongoose, when you use Model.create([document], { session }) with an array of documents, even if it's just a single document in that array, the method returns an array of documents. This is consistent behavior with how Mongoose handles bulk creation, allowing you to create multiple documents in a single operation. Therefore, even though you're only creating one document, because you're passing it in an array, the return value is an array of created documents. To access the first (and in this case, only) document, you need to use array notation ([0]) to access the document and then get its _id.

In contrast, if you were to call Model.create(document, { session }) without wrapping the document in an array, the return value would be a single document object, and you could directly access its _id with address._id.

This is an important distinction to make because it affects how you access the returned document's properties. If you're consistently using the array notation for a single document creation due to using transactions or expecting to potentially expand to bulk operations in the future, you'll need to remember to access the document using the [0] index.
 */

export const updateActivity = async (
  req: CustomRequest,
  res: Response
): Promise<void> => {
  const { slug } = req.params;
  const userIdFromToken = req.user?.userId;
  const session = await mongoose.startSession();

  try {
    session.startTransaction();
    // Retrieve user role along with the user ID from the token
    const user = await UserModel.findById(userIdFromToken).session(session);
    const isUserAdmin = user && user.role === "ADMIN";

    // Find activity by slug
    const activity = await ActivityModel.findOne({ slug }, null, { session });

    if (!activity) {
      await session.abortTransaction();
      res.status(404).json({ message: "Activity not found" });
      return;
    }

    // Check if the user is the creator or an admin
    if (!isUserAdmin && activity.createdBy.toString() !== userIdFromToken) {
      await session.abortTransaction();
      res
        .status(403)
        .json({ message: "You are not authorized to update this activity" });
      return;
    }

    const validationResult = activityValidationSchema.validate(req.body);
    if (validationResult.error) {
      await session.abortTransaction();
      res.status(400).json({ message: validationResult.error.message });
      return;
    }

    // Assuming validationResult.value includes potential updates for address, startCoordinate, and endCoordinate
    if (validationResult.value.address) {
      // Check if the activity already has an address to decide between update or create
      let addressDoc;
      if (activity.address) {
        addressDoc = await AddressModel.findOneAndUpdate(
          { _id: activity.address },
          { $set: validationResult.value.address },
          { new: true, session, runValidators: true }
        );
      } else {
        // Directly pass the object without wrapping it in an array
        addressDoc = await AddressModel.create(
          {
            ...validationResult.value.address,
            activityId: activity._id,
          },
          { session }
        );
      }

      // Ensure only the ObjectId is used in the ActivityModel update
      validationResult.value.address = (addressDoc as any)._id;
    }

    if (validationResult.value.startCoordinate) {
      let startCoordinateDoc;
      if (activity.startCoordinate) {
        startCoordinateDoc = await StartCoordinateModel.findOneAndUpdate(
          { activityId: activity._id },
          { $set: validationResult.value.startCoordinate },
          { new: true, session, runValidators: true }
        );
      } else {
        startCoordinateDoc = await StartCoordinateModel.create(
          {
            ...validationResult.value.startCoordinate,
            activityId: activity._id,
          },
          { session }
        );
      }
      validationResult.value.startCoordinate = (startCoordinateDoc as any)._id;
    }

    if (validationResult.value.endCoordinate) {
      let endCoordinateDoc;
      if (activity.endCoordinate) {
        endCoordinateDoc = await EndCoordinateModel.findOneAndUpdate(
          { activityId: activity._id },
          { $set: validationResult.value.endCoordinate },
          { new: true, session, runValidators: true }
        );
      } else {
        endCoordinateDoc = await EndCoordinateModel.create(
          { ...validationResult.value.endCoordinate, activityId: activity._id },
          { session }
        );
      }
      validationResult.value.endCoordinate = (endCoordinateDoc as any)._id;
    }

    // Generate a new slug if the name has changed
    if (
      validationResult.value.name &&
      validationResult.value.name !== activity.name
    ) {
      validationResult.value.slug = slugify(validationResult.value.name, {
        replacement: "-",
        remove: undefined,
        lower: true,
        strict: false,
        trim: true,
      });
    }

    // Then proceed to update the activity, now with the address being an ObjectId
    const updatedActivity = await ActivityModel.findOneAndUpdate(
      { slug: activity.slug }, //use the original slug to find the activity
      { $set: validationResult.value },
      { new: true, session, runValidators: true } // Returns the updated document and uses the session
    );

    if (!updatedActivity) {
      await session.abortTransaction();
      res.status(404).json({ message: "Activity not found" });
      return;
    }

    await session.commitTransaction();
    res.status(200).json(updatedActivity);
  } catch (error) {
    await session.abortTransaction();
    res.status(500).json({ error: error.message });
  } finally {
    session.endSession();
  }
};

export const deleteActivity = async (
  req: CustomRequest,
  res: Response
): Promise<void> => {
  const { slug } = req.params;
  const userIdFromToken = req.user?.userId;
  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    // Retrieve user role along with the user ID from the token
    const user = await UserModel.findById(userIdFromToken).session(session);
    const isUserAdmin = user && user.role === "ADMIN";

    // Find activity by slug
    const activity = await ActivityModel.findOne({ slug }, null, { session });

    if (!activity) {
      await session.abortTransaction();
      res.status(404).json({ message: "Activity not found" });
      return;
    }

    // Check if the user is the creator or an admin
    if (!isUserAdmin && activity.createdBy.toString() !== userIdFromToken) {
      await session.abortTransaction();
      res
        .status(403)
        .json({ message: "You are not authorized to delete this activity" });
      return;
    }

    const activityId = activity._id;

    // Delete related documents - related addresses start and end coordinates
    await AddressModel.findOneAndDelete(
      { activityId: activityId },
      { session }
    );

    await StartCoordinateModel.findOneAndDelete(
      { activityId: activityId },
      { session }
    );

    await EndCoordinateModel.findOneAndDelete(
      { activityId: activityId },
      { session }
    );

    const deletedActivity = await ActivityModel.findByIdAndDelete(activityId, {
      session,
    });
    if (!deletedActivity) {
      await session.abortTransaction();
      res.status(404).json({ message: "Activity not found" });
      return;
    }

    await session.commitTransaction();
    res.status(204).send(); // 204 No Content for successful deletes
  } catch (error) {
    await session.abortTransaction();
    res.status(500).json({ error: error.message });
  } finally {
    session.endSession();
  }
};

//Database Seeding
export const seedDatabaseWithMultipleActivities = async (
  req: CustomRequest,
  res: Response
) => {
  const userId = req.user?.userId;
  const activitiesData = req.body.activities; // Expecting an array of activities in the request body
  const session = await mongoose.startSession();
  try {
    await session.startTransaction();
    const user = await UserModel.findById(userId).session(session);
    if (!user) {
      throw new Error("User not found");
    }
    const isUserAdmin = user.role === "ADMIN";

    for (const activityInput of activitiesData) {
      const validationResult = activityValidationSchema.validate(activityInput);
      if (validationResult.error) {
        throw new Error(validationResult.error.message); // Consider accumulating errors for all activities instead
      }

      const activityData = {
        ...validationResult.value,
        slug: slugify(validationResult.value.name, {
          lower: true,
          strict: true,
        }),
        createdBy: userId,
        isCreatedByAdmin: isUserAdmin,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      // Address
      if (activityData.address) {
        const addressDoc = await AddressModel.create([activityData.address], {
          session,
        });
        activityData.address = addressDoc[0]._id;
      }

      // StartCoordinate
      if (activityData.startCoordinate) {
        const startCoordinateDoc = await StartCoordinateModel.create(
          [activityData.startCoordinate],
          { session }
        );
        activityData.startCoordinate = startCoordinateDoc[0]._id;
      }

      // EndCoordinate
      if (activityData.endCoordinate) {
        const endCoordinateDoc = await EndCoordinateModel.create(
          [activityData.endCoordinate],
          { session }
        );
        activityData.endCoordinate = endCoordinateDoc[0]._id;
      }

      // Create the activity
      await ActivityModel.create([activityData], { session });
    }

    await session.commitTransaction();
    res.status(201).json({
      message: `${activitiesData.length} activities created successfully.`,
    });
  } catch (error) {
    await session.abortTransaction();
    res.status(500).json({ error: error.message });
  } finally {
    session.endSession();
  }
};
