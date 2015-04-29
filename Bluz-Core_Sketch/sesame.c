#define SERVO_PIN 0
#define LOCK_POSITION 40
#define UNLOCK_POSITION 120

Servo myservo;

//unlock the servo, just rotate it
int unlock(String command)
{
	myservo.write(UNLOCK_POSITION);
	return 1;
}

//unlock the servo, just rotate it
int lock(String command)
{
	myservo.write(LOCK_POSITION);
	return 1;
}

void setup() {
    myservo.attach(SERVO_PIN);
    Spark.function("lock", lock);
    Spark.function("unlock", unlock);
    unlock("");
}

void loop() {

}