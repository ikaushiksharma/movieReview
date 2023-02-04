const Actor = require("../models/actor");
const { sendError, uploadImageToCloud, formatActor } = require("../utils/helper");
const dotenv = require("dotenv");
const cloudinary = require("../cloud");
const { isValidObjectId } = require("mongoose");
dotenv.config();

exports.create = async (req, res) => {
  const { name, about, gender } = req.body;
  const { file } = req;
  const newActor = new Actor({ name, about, gender });
  if (file) {
    const { url, public_id } = await uploadImageToCloud(file.path);
    newActor.avatar = { public_id, url };
  }
  await newActor.save();
  res.status(201).json(formatActor(newActor));
};

exports.update = async (req, res) => {
  const { actorId } = req.params;
  const { name, about, gender } = req.body;
  const { file } = req;
  if (!isValidObjectId(actorId)) return sendError(res, "Invalid Request!");

  const actor = await Actor.findById(actorId);

  if (!actor) return sendError(res, "Invalid Request!, record not found");

  const public_id = actor.avatar?.public_id;
  if (public_id && file) {
    const { result } = await cloudinary.uploader.destroy(public_id);
    if (result != "ok") return sendError(res, "Could not remove image from the cloud!");
  }

  if (file) {
    const { url, public_id } = await uploadImageToCloud(file.path);
    newActor.avatar = { public_id, url };
  }
  actor.name = name;
  actor.about = about;
  actor.gender = gender;

  await actor.save();
  res.status(201).json(formatActor(actor));
};

exports.remove = async (req, res) => {
  const { actorId } = req.params;

  if (!isValidObjectId(actorId)) return sendError(res, "Invalid Request!");

  const actor = await Actor.findById(actorId);

  if (!actor) return sendError(res, "Invalid Request!, record not found");
  const public_id = actor.avatar?.public_id;
  if (public_id) {
    const { result } = await cloudinary.uploader.destroy(public_id);
    if (result != "ok") return sendError(res, "Could not remove image from the cloud!");
  }
  await Actor.findByIdAndDelete(actorId);
  res.json({ message: "Record removed successfully." });
};

exports.search = async (req, res) => {
  const { query } = req;
  const result = await Actor.find({ $text: { $search: `"${query.name}"` } });
  const actors = result.map((actor) => formatActor(actor));
  res.json(actors);
};
exports.getLatestActors = async (req, res) => {
  const result = await Actor.find().sort({ createdAt: "-1" }).limit(12);
  const actors = result.map((actor) => formatActor(actor));
  res.json(actors);
};
exports.getSingleActor = async (req, res) => {
  const { actorId } = req.params;
  if (!isValidObjectId(actorId)) return sendError(res, "Invalid Request!");
  const actor = await Actor.findById(actorId);
  if (!actor) return sendError(res, "Invalid Request!, actor not found", 404);
  res.json(formatActor(actor));
};