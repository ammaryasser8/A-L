const PROFILES_KEY = 'al-guest-profiles';

function readProfiles() {
  try {
    const profiles = JSON.parse(localStorage.getItem(PROFILES_KEY) || '{}');
    return profiles && typeof profiles === 'object' ? profiles : {};
  } catch {
    return {};
  }
}

export const guestProfileService = {
  getProfile(id) {
    const profile = readProfiles()[id];
    return profile && typeof profile === 'object' ? profile : null;
  },

  getCompletion(profile) {
    const fields = [profile.phone, profile.country, profile.birthday, profile.language,
      profile.preferences?.room, profile.preferences?.view, profile.preferences?.dietary];
    return Math.round((fields.filter(Boolean).length / fields.length) * 100);
  },
};
