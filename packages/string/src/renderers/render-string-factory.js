export const renderStringFactory = (item, { safe, encode }) =>
  safe ? encode(item.toString()) : item.toString();
