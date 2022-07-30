import 'package:four_thousand/controller/clock_controller.dart';
import 'package:get/get.dart';

class ClockBinding extends Bindings {
  @override
  void dependencies() {
    Get.lazyPut(() => ClockController());
  }
}
