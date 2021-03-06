
const stringify = (value, depth) => {
  if (!(value instanceof Object)) {
    return value;
  }
  const indent = depth * 4 + 2;
  const result = Object.keys(value).map((key) => `${' '.repeat(indent)}${key}: ${value[key]}`);
  return `{\n${result.join('\n')}\n${' '.repeat(indent - 4)}}`;
};

const types = {
  nested: (obj, depth, func) => `  ${obj.key}: ${func(obj.content.children, depth + 1)}`,
  added: (obj, depth) => `+ ${obj.key}: ${stringify(obj.content.value, depth + 1)}`,
  deleted: (obj, depth) => `- ${obj.key}: ${stringify(obj.content.value, depth + 1)}`,
  changed: (obj, depth) => `- ${obj.key}: ${stringify(obj.content.beforeValue, depth + 1)}
    + ${obj.key}: ${stringify(obj.content.afterValue, depth + 1)}`,
  unchanged: (obj, depth) => `  ${obj.key}: ${stringify(obj.content.value, depth + 1)}`,
};

const renderStringByType = (element, depth, func) => {
  const indent = depth * 4;
  return `${' '.repeat(indent)}${types[element.typeName](element, depth, func)}`;
};

const render = (data, depth = 0) => {
  const indent = depth * 4;
  const result = data.map((element) => `${renderStringByType(element, depth, render)}`);
  return `{\n${result.join('\n')}\n${' '.repeat(indent > 2 ? indent - 2 : indent)}}`;
};

export default render;
