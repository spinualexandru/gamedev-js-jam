export const fetchEntitiesByType = async (
  scene: Phaser.Scene,
  type: "name"
) => {
  return scene.children.getAll().filter((child) => child.type === type);
};

export const fetchEntitiesByName = async (
  scene: Phaser.Scene,
  name: string
) => {
  return scene.children.getAll().filter((child) => child.name === name);
};
