#!/usr/bin/python3
from mpu6050 import mpu6050
import paho.mqtt.client as mqtt
import time, requests


"""

Here's the link to the public view: https://thingspeak.com/channels/1357299

"""


TS_API_KEY = "HLTWOF0I2LFKBZPV"
TS_CHANNEL = "1364970"
TS_CLIENT_ID = "project_client_id1"
TS_AUTHOR = "mwa0000022192889"
TS_PASSWD = "K2LRCCNZR5E6IVKK"
MQTT_DOMAIN = "mqtt.thingspeak.com"
MQTT_PORT = 1883


def on_publish(client, userdata, result):
    print("Published ", result);

def connectionSetup():
    client = mqtt.Client(client_id=TS_CLIENT_ID, clean_session=True, userdata=None, protocol=mqtt.MQTTv311, transport="tcp")
    
    # Set callbacks
    client.on_connect = lambda client, userdata, flags, rc: print("Connected ", rc)
    client.on_publish = on_publish
    #client.on_publish = lambda client, userdata, flags, result: print("Published ", result)

    # Set login info and host info
    client.username_pw_set(TS_AUTHOR, password=TS_PASSWD)
    client.connect(MQTT_DOMAIN, port=MQTT_PORT, keepalive=60)

    return client

def main():
    mpu = mpu6050(0x68) # Grab the gyro/temp sensor by its address

    # Client instance
    client = connectionSetup()
    client.loop_start()

    publish_route = "channels/" + TS_CHANNEL + "/publish/" + TS_API_KEY

    try:
        while True:
            time.sleep(15)

            if not client.is_connected():
                print("Could not connect. Retrying...")
                client.reconnect()
            
            else:
                gyro = mpu.get_gyro_data()
                temp = mpu.get_temp()

                tmp = str(round(temp))
                x = str(round(gyro['x']))
                y = str(round(gyro['y']))
                z = str(round(gyro['z']))


                data = "field1=" + tmp + "&field2=" + x + "&field3=" + y + "&field4=" + z

                print("\n\n")
                print("Temp: " + str(round(temp)))
                print("Xval: " + str(round(gyro['x'])))
                print("Yval: " + str(round(gyro['y'])))

                # Post the request to the site, so that it can be emitted to all the clients
                requests.post("http://raspberrypi.local:3000/sendDeviceData", data={
                    "tmp":tmp,
                    "x":x,
                    "y":y,
                    "z":z,
                    "apiKey":"_xY|Ytr#T!*MOj>ladOc"
                })

                # Publish to Thingspeak
                client.publish(publish_route, data)

    except KeyboardInterrupt:
        client.disconnect()


if __name__ == "__main__":
    main()
