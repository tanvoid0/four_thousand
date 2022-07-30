import 'dart:async';

import 'package:get/get.dart';
import 'package:get_storage/get_storage.dart';

class SplashController extends GetxController {
  GetStorage box = GetStorage();
  static const String routeName = "/splash";

  startChecking() {
    Timer(const Duration(seconds: 2), () {
      if (box.hasData('auth')) {
        Get.offNamed('/product');
      } else {
        Get.offNamed('/auth');
      }
    });
  }

  @override
  void onReady() {
    startChecking();
    super.onReady();
  }
}
