import { m as mbidCategoryTable } from "./parseData.js";
import { b as PUBLIC_LAST_FM_API_KEY } from "./public.js";
const lastFmApiKey = PUBLIC_LAST_FM_API_KEY;
const mbidCateogory = function(searchCategory) {
  return mbidCategoryTable[searchCategory];
};
function getMegaImage(img) {
  return img.size == "mega";
}
const getLastFmCoverArt = async function(releaseGroup) {
  try {
    const lastFmEndpoint = `https://ws.audioscrobbler.com/2.0/?method=album.getinfo&api_key=${lastFmApiKey}&artist=${releaseGroup.artist_name}&album=${releaseGroup.release_group_name}&format=json`;
    const lastFmRes = await fetch(lastFmEndpoint);
    const lastFmData = await lastFmRes.json();
    const imgArray = lastFmData["album"]["image"];
    const megaImg = imgArray.find(getMegaImage);
    const coverArtUrl = megaImg["#text"];
    return coverArtUrl;
  } catch (error) {
    const coverArtUrl = null;
    return coverArtUrl;
  }
};
const checkDuplicate = function(mbid, addedItems, deletedItems, mbidCategory) {
  if (deletedItems.length < 1) {
    return { isDuplicate: false, duplicateItem: null };
  }
  const findMbidDuplicate = addedItems.find((element) => element[mbidCategory] == mbid);
  const findUserAddedMetadataDuplicate = addedItems.find((element) => element["user_added_metadata_id"] == mbid);
  const isDuplicate = findMbidDuplicate || findUserAddedMetadataDuplicate ? true : false;
  const duplicateItem = isDuplicate ? findMbidDuplicate ?? findUserAddedMetadataDuplicate : null;
  return { isDuplicate, duplicateItem };
};
export {
  checkDuplicate as c,
  getLastFmCoverArt as g,
  mbidCateogory as m
};
