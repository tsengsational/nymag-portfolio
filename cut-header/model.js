'use strict';

module.exports.render = function (ref, data, locals) {
  if (data.useSvgHeader && locals.params) {
    data.sectionKey = locals.params.name.replace('@published', '');
  }

  return data;
};
