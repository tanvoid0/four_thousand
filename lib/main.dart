import 'package:flutter/material.dart';
import 'package:four_thousand/controller/splash_controller.dart';
import 'package:four_thousand/data/init_data.dart';
import 'package:get/get.dart';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return GetMaterialApp(
      debugShowCheckedModeBanner: false,
      title: 'FourThousand',
      theme: ThemeData.dark(),
      getPages: [...routes],
      initialRoute: SplashController.routeName,
    );
  }
}
