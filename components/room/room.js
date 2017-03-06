let Room = {
    schema: {
        color: { default: '#ff000' },
        doors: { default: ['N','S'] }
    },

    init: function () {
        var scene = this.el.sceneEl.object3d;
    },

    update: function () {
        var material = new THREE.MeshBasicMaterial({color: this.data.color, side: THREE.BackSide});
        var geometry = new THREE.BoxBufferGeometry(5, 5, 5);

        var doorMeshes =

        this.el.setObject3D('mesh', new THREE.Mesh(geometry, material));
    },

    remove: function () {
        this.el.removeObject3D('mesh');
    }
}

module.exports = Room;
