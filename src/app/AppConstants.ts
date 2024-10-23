export class AppConstants {
  constructor() {
  }

  public static BASE_URL = 'https://api.taitorakentajat.fi';
  public static API = {
    LOGIN: AppConstants.BASE_URL + '/auth/local',
    REGISTER: AppConstants.BASE_URL + '/signup',
    SERVICES: AppConstants.BASE_URL + '/services',
    ME: AppConstants.BASE_URL + '/users/me',
    PACKAGES: AppConstants.BASE_URL + '/product-packages',
    SLOTS: AppConstants.BASE_URL + '/slots',
    PATCH_ACCOUNT: AppConstants.BASE_URL + '/accounts/',
    BOOKINGS: AppConstants.BASE_URL + '/bookings',
    ACCOUNTS: AppConstants.BASE_URL + '/accounts',
    PROFILE: AppConstants.BASE_URL + '/profile',
    CITIES: AppConstants.BASE_URL + '/cities',
    PLACE_BOOKING: AppConstants.BASE_URL + '/place/booking',
    UPLOAD_IMAGES: AppConstants.BASE_URL + '/upload',
    POSTCODE: AppConstants.BASE_URL + '/cities',
    PRODUCT: AppConstants.BASE_URL + '/products/',
  };

  public static selectedService;
}
