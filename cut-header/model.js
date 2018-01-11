// Copyright (C) New York Media, LLC
// Unauthorized copying of this file, via any medium is strictly prohibited
// Proprietary and confidential
// Written by Jason Tseng <jason.tseng@nymag.com>, 2018

'use strict';

module.exports.render = function (ref, data, locals) {
  if (data.useSvgHeader && locals.params) {
    data.sectionKey = locals.params.name.replace('@published', '');
  }

  return data;
};
