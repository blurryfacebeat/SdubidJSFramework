const h = (tag, props, children) => ({tag, props, children});

const mount = (vNode, container) => {
  const {tag, props, children} = vNode;

  const el = document.createElement(tag);
  Object.entries(props).forEach(([key, value]) => el.setAttribute(key, value));

  typeof children === 'string'
    ? el.textContent = children
    : children.forEach((child) => {
      mount(child, el);
    });

  container.append(el);
  vNode.$el = el;
};

const unmount = (vNode) => vNode.$el.parentNode.removeChild(vNode.$el);

const patch = (oldVNode, newVNode) => {
  const {tag: oldTag, children: oldChildren} = oldVNode;
  const {tag: newTag, props: newProps, children: newChildren} = newVNode;

  if (oldTag !== newTag) {
    mount(newVNode, oldVNode.$el.parentNode);
    unmount(oldVNode);
    return;
  }

  newVNode.$el = oldVNode.$el;

  if (typeof newChildren === 'string') {
    newVNode.$el.textContent = newChildren;
    return;
  }

  while (newVNode.$el.attributes.length > 0) newVNode.$el.removeAttribute(newVNode.$el.attributes[0].name);
  Object.entries(newProps).forEach(([key, value]) => newVNode.$el.setAttribute(key, value));

  if (typeof oldChildren === 'string') {
    newVNode.$el.textContent = null;
    newChildren.forEach((child) => mount(child, newChildren.$el));
    return;
  }

  const commonLength = Math.min(oldChildren.length, newChildren.length);

  for (let i = 0; i < commonLength; i++) {
    patch(oldChildren[i], newChildren[i]);
  }

  oldChildren.length > newChildren.length
    ? oldChildren.slice(newChildren.length).forEach((child) => unmount(child))
    : newChildren.slice(oldChildren.length).forEach((child) => mount(child));
};