import _ from 'lodash';

const SetStatus = (beforeValue, afterValue) => {
  if (beforeValue === undefined) {
    return 'added';
  }
  if (afterValue === undefined) {
    return 'deleted';
  }
  if (beforeValue === afterValue) {
    return 'unchanged';
  }
  if (beforeValue instanceof Object && afterValue instanceof Object) {
    return 'unchanged';
  }
  return 'edited';
};

const isObjects = (firstUnit, secondUnit) => firstUnit instanceof Object
  && secondUnit instanceof Object;

const genDiff = (firstConfig, secondConfig) => {
  const union = _.merge({}, firstConfig, secondConfig);
  const keys = Object.keys(union);

  const diff = keys.map((current) => {
    const beforeValue = _.has(firstConfig, current) ? firstConfig[current] : undefined;
    const afterValue = _.has(secondConfig, current) ? secondConfig[current] : undefined;
    const status = SetStatus(beforeValue, afterValue);
    const type = isObjects(firstConfig[current], secondConfig[current]) ? 'obj' : 'key';
    const children = isObjects(firstConfig[current], secondConfig[current])
      ? genDiff(firstConfig[current], secondConfig[current]) : [];

    return {
      name: current,
      type,
      beforeValue,
      afterValue,
      children,
      status,
    };
  });
  return diff.sort((a, b) => a.name - b.name);
};

export default genDiff;
