import 'package:four_thousand/controller/auth_controller.dart';
import 'package:four_thousand/controller/bindings/auth_binding.dart';
import 'package:four_thousand/controller/bindings/cart_binding.dart';
import 'package:four_thousand/controller/bindings/clock_binding.dart';
import 'package:four_thousand/controller/bindings/product_binding.dart';
import 'package:four_thousand/controller/bindings/splash_binding.dart';
import 'package:four_thousand/controller/cart_controller.dart';
import 'package:four_thousand/controller/clock_controller.dart';
import 'package:four_thousand/controller/product_controller.dart';
import 'package:four_thousand/controller/splash_controller.dart';
import 'package:four_thousand/models/airsoft.dart';
import 'package:four_thousand/views/auth_screen.dart';
import 'package:four_thousand/views/cart_screen.dart';
import 'package:four_thousand/views/clock_screen.dart';
import 'package:four_thousand/views/product_screen.dart';
import 'package:four_thousand/views/splash_screen.dart';
import 'package:get/get.dart';

List<Airsoft> airsoftData = [
  Airsoft(
      id: 1,
      name: "Airsoft M14 AEG",
      price: 1000000,
      image: "assets/images/evike.png",
      qty: 0),
  Airsoft(
      id: 2,
      name: "Airsoft M1 Garrand GBB",
      price: 2000000,
      image: "assets/images/evike.png",
      qty: 0),
  Airsoft(
      id: 3,
      name: "Airsoft Mosin Nagant Spring",
      price: 2800000,
      image: "assets/images/evike.png",
      qty: 0),
  Airsoft(
      id: 4,
      name: "Airsoft AK47 AEG",
      price: 2700000,
      image: "assets/images/evike.png",
      qty: 0),
  Airsoft(
    id: 5,
    name: "Airsoft M4 AEG",
    price: 3500000,
    qty: 0,
    image: "assets/images/evike.png",
  ),
  Airsoft(
    id: 6,
    qty: 0,
    name: "Airsoft Dragunov GBB",
    price: 6000000,
    image: "assets/images/evike.png",
  ),
];

List<GetPage> routes = [
  GetPage(
    name: ProductController.routeName,
    page: () => ProductScreen(),
    binding: ProductBinding(),
  ),
  GetPage(
    name: AuthController.routeName,
    page: () => AuthScreen(),
    binding: AuthBinding(),
  ),
  GetPage(
    name: SplashController.routeName,
    page: () => SplashScreen(),
    binding: SplashBinding(),
  ),
  GetPage(
    name: CartController.routeName,
    page: () => CartScreen(),
    binding: CartBinding(),
  ),
  GetPage(
    name: ClockController.routeName,
    page: () => ClockScreen(),
    binding: ClockBinding(),
  )
];
