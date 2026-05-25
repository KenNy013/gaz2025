const mainColor = '#015694';

export const theme = {
  token: {
    colorPrimary: mainColor,
    colorBgContainer: "#ffffff",
    borderRadius: 4,

    motionDurationMid: '0.3s',
    motionEaseInOut: 'ease-in-out',
  },
  components: {
    Layout: {
      siderBg: mainColor,
      headerBg: "#ffffff",
      headerHeight: 64,
    },
    Menu: {
      darkItemBg: mainColor,
      darkItemColor: "rgba(255, 255, 255, 0.85)",
      darkItemSelectedColor: "#ffffff",
      darkItemSelectedBg: "#004475",
      darkItemHoverColor: "#ffffff",
      darkSubMenuItemBg: mainColor,
    },
    Typography: {
      colorTextDescription: "rgba(255, 255, 255, 0.65)",
    },
    Card: {
      borderRadiusLG: 20,
    }
  },
};
