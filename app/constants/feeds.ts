export const mainFeeds = [
  "Seneste nyt",
  "Indland",
  "Udland",
  "Penge",
  "Politik",
  "Sporten",
  "Viden",
  "Kultur",
  "Musik",
  "Vejret",
] as const;

export const regionalFeeds = [
  "DR Hovedstadsområdet",
  "DR Bornholm",
  "DR Syd og Sønderjylland",
  "DR Fyn",
  "DR Midt- og Vestjylland",
  "DR Nordjylland",
  "DR Trekantområdet",
  "DR Sjælland",
  "DR Østjylland",
] as const;

export const allFeeds = [
  ...mainFeeds,
  "Regionale",
  ...regionalFeeds,
] as const;