import { Vector3 } from 'super-three';

let debug = AFRAME.utils.debug;
let coordinates = AFRAME.utils.coordinates;

let warn = debug('components:look-at:warn');
let isCoordinates = coordinates.isCoordinates || coordinates.isCoordinate;

AFRAME.registerComponent('look-at', {
  schema: {
    default: '0 0 0',

    parse: function (value) {
      // A static position to look at.
      if (isCoordinates(value) || typeof value === 'object') {
        return coordinates.parse(value);
      }
      // A selector to a target entity.
      return value;
    },

    stringify: function (data) {
      if (typeof data === 'object') {
        return coordinates.stringify(data);
      }
      return data;
    }
  },

  init: function () {
    this.target3D = null;
    this.vector = new Vector3();
    this.cameraListener = AFRAME.utils.bind(this.cameraListener, this);
    this.el.addEventListener('componentinitialized', this.cameraListener);
    this.el.addEventListener('componentremoved', this.cameraListener);
  },

  /**
   * If tracking an object, this will be called on every tick.
   * If looking at a position vector, this will only be called once (until further updates).
   */
  update: function () {
    let self = this;
    let target = self.data;
    let targetEl;

    // No longer looking at anything (i.e., look-at="").
    if (!target || (typeof target === 'object' && !Object.keys(target).length)) {
      return self.remove();
    }

    // Look at a position.
    if (typeof target === 'object') {
      this.lookAt(new Vector3(target.x, target.y, target.z));
      return this.endTracking();
    }

    // Assume target is a string.
    // Query for the element, grab its object3D, then register a behavior on the scene to
    // track the target on every tick.
    targetEl = self.el.sceneEl.querySelector(target);
    if (!targetEl) {
      warn('"' + target + '" does not point to a valid entity to look-at');
      return;
    }
    if (!targetEl.hasLoaded) {
      return targetEl.addEventListener('loaded', function () {
        self.beginTracking(targetEl);
      });
    }
    return self.beginTracking(targetEl);
  },

  tick: (function () {
    let vec3 = new Vector3();

    return function (t) {
      // Track target object position. Depends on parent object keeping global transforms up
      // to state with updateMatrixWorld(). In practice, this is handled by the renderer.
      let target3D = this.target3D;
      if (target3D) {
        target3D.getWorldPosition(vec3);
        this.lookAt(vec3);
      }
    }
  })(),

  remove: function () {
    this.el.removeEventListener('componentinitialized', this.cameraListener);
    this.el.removeEventListener('componentremoved', this.cameraListener);
  },

  beginTracking: function (targetEl) {
    this.target3D = targetEl.object3D;
  },

  endTracking: function () {
    this.target3D = null;
  },

  cameraListener: function (e) {
    if (e.detail && e.detail.name === 'camera') {
      this.update();
    }
  },

  lookAt: function (position) {
    let vector = this.vector;
    let object3D = this.el.object3D;

    if (this.el.getObject3D('camera')) {
      // Flip the vector to -z, looking away from target for camera entities. When using
      // lookat from THREE camera objects, this is applied for you, but since the camera is
      // nested into a Object3D, we need to apply this manually.
      vector.subVectors(object3D.position, position).add(object3D.position);
    } else {
      vector.copy(position);
    }

    object3D.lookAt(vector);
  }
});