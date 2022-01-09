import { Request, Response } from "express";
import shortUrl from "../models/shortUrl.model";
import analytics from "../models/analytics.model";

export async function createShortUrl(req: Request, res: Response) {
  //get the destination from the request body
  const { destination } = req.body;
  console.log("dest: " + destination);
  //create short url
  const newUrl = await shortUrl.create({ destination });
  //return short url
  return res.send(newUrl);
}

export async function handleRedirect(req: Request, res: Response) {
  const { shortId } = req.params;
  const shortURL = await shortUrl.findOne({ shortId }).lean();

  if (!shortURL) {
    return res.sendStatus(404);
  }
  analytics.create({ shortUrl: shortURL._id });
  return res.redirect(shortURL.destination);
}

export async function getAnalytics(req: Request, res: Response) {
  const data = await analytics.find({}).lean();
  return res.send(data);
}
