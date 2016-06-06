/**
 * @license
 * Copyright 2016 Google Inc.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import {RefCounted} from 'neuroglancer/util/disposable';
import {GlobalKeyboardShortcutHandler, KeySequenceMap} from 'neuroglancer/util/keyboard_shortcut_handler';

require('./overlay.css');

export let overlaysOpen = 0;

export class Overlay extends RefCounted {
  container: HTMLDivElement;
  keyboardShortcutHandler: GlobalKeyboardShortcutHandler;
  content: HTMLDivElement;
  constructor(public keySequenceMap: KeySequenceMap) {
    super();
    ++overlaysOpen;
    let container = this.container = document.createElement('div');
    container.className = 'overlay';
    let content = this.content = document.createElement('div');
    content.className = 'overlay-content';
    container.appendChild(content);
    document.body.appendChild(container);
    this.keyboardShortcutHandler = this.registerDisposer(
        new GlobalKeyboardShortcutHandler(keySequenceMap, this.commandReceived.bind(this)));
  }

  commandReceived(action: string) {
    if (action === 'close') {
      this.dispose();
    }
    return false;
  }

  disposed() {
    --overlaysOpen;
    document.body.removeChild(this.container);
  }
};