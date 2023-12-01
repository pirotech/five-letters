const key =
  'dict.1.1.20231113T195812Z.60b6e818334d7876.b85aeb41f551a76db17a5ce2018e01403f4caf9b';
export const findWord = async (text: string): Promise<{ def: any[] }> => {
  return fetch(
    `https://dictionary.yandex.net/api/v1/dicservice.json/lookup?key=${key}&lang=ru-ru&text=${text}`,
  ).then(async (response) => {
    return await response.json();
  });
};
