import 'package:flutter/material.dart';
import 'package:four_thousand/controller/splash_controller.dart';
import 'package:get/get.dart';

class SplashScreen extends StatelessWidget {
  late SplashController controller;

  @override
  Widget build(BuildContext context) {
    controller = Get.find<SplashController>();

    return Scaffold(
      body: Center(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.center,
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Image.asset('assets/images/evike.png'),
            const Text('The Ultimate Airsoft Shop'),
          ],
        ),
      ),
    );
  }
}
