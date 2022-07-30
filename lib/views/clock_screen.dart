import 'package:flutter/material.dart';
import 'package:four_thousand/controller/clock_controller.dart';
import 'package:get/get.dart';

class ClockScreen extends StatelessWidget {
  late ClockController controller;

  final digits = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

  @override
  Widget build(BuildContext context) {
    controller = Get.find<ClockController>();
    return Scaffold(
      body: StreamBuilder(
          stream: Stream.periodic(const Duration(seconds: 1)),
          builder: (context, snapshot) {
            controller.countDownTimer();
            if (controller.countdownTotalSeconds < -4) {
              return Center(child: CircularProgressIndicator());
            }
            return Obx(() => Stack(
                  children: [
                    Container(
                      decoration: BoxDecoration(
                        image: DecorationImage(
                          image: NetworkImage(
                              "https://mediacloud.theweek.co.uk/image/private/s--qdtGn_CD--/f_auto,t_primary-image-desktop@1/v1632480603/theweek/2021/09/Four%20Thousand%20Weeks%20Oliver%20Burkeman%20main.jpg"),
                          fit: BoxFit.fitWidth,
                        ),
                      ),
                    ),
                    Center(
                      child: Column(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          Text("Weeks: ${(controller.countdownWeeks).round()}",
                              style: textStyle),
                          Text("Days: ${controller.countdownDays.value}",
                              style: textStyle),
                          Text("Hours: ${controller.countdownHours.value}",
                              style: textStyle),
                          Text("minutes: ${controller.countdownMinutes.value}",
                              style: textStyle),
                          Text("Seconds: ${controller.countdownSeconds.value}",
                              style: textStyle),
                        ],
                      ),
                    ),
                    const Positioned(
                        bottom: 10,
                        right: 10,
                        child: Text("Concept: Four Thousand Weeks by Oliver"))
                  ],
                ));
          }),
    );
  }

  final textStyle = TextStyle(
      backgroundColor: Colors.black.withOpacity(.5),
      fontWeight: FontWeight.bold,
      fontSize: 30);
}
