import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:get_storage/get_storage.dart';

class AuthController extends GetxController {
  GlobalKey<FormState> globalKey = GlobalKey<FormState>();

  static const String authKey = "auth";
  static const String routeName = "/auth";
  String name = "", email = "", password = "";

  RxBool isObsecure = true.obs;

  void toggleObsecure() {
    isObsecure.value = isObsecure.value != true;
  }

  void saveSession() {
    if (globalKey.currentState!.validate()) {
      globalKey.currentState!.save();

      Map<String, dynamic> auth = {
        "name": name,
        "email": email,
        "password": password,
      };
      GetStorage().write(authKey, auth);
      Get.offAllNamed("/product");
    }
  }
}
