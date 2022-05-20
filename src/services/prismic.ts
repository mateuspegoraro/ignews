import Prismic from "@prismicio/client";

export const getPrismicClient = (req?: unknown) => {
  const prismic = Prismic.client(process.env.PRISMIC_REPO_URL, {
    req,
    accessToken: process.env.PRISMIC_ACCESS_TOKEN,
  });
  return prismic;
};
