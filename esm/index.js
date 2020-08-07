export default (whenDefined, MutationObserver) => {

  const attributeChanged = records => {
    for (let i = 0, {length} = records; i < length; i++)
      dispatch(records[i]);
  };

  const dispatch = ({target, attributeName, oldValue}) => {
    target.attributeChangedCallback(
      attributeName,
      oldValue,
      target.getAttribute(attributeName)
    );
  };

  return (target, is) => {
    const {observedAttributes: attributeFilter} = target.constructor;
    if (attributeFilter) {
      whenDefined(is).then(() => {
        new MutationObserver(attributeChanged).observe(target, {
          attributes: true,
          attributeOldValue: true,
          attributeFilter
        });
        for (let i = 0, {length} = attributeFilter; i < length; i++) {
          if (target.hasAttribute(attributeFilter[i]))
            dispatch({target, attributeName: attributeFilter[i], oldValue: null});
        }
      });
    }
    return target;
  };
};
