# Tool made to parse CSV files containing all the charactheristics addressables from BLE/LoRa (extractged from TechSpec) to a JS Object
import os
import csv

for file in os.listdir("charac"):
    with open("charac/" + file, newline='') as fs:
        csvfile = csv.DictReader(fs,delimiter=",")
        output = []
        for row in csvfile:
            output.append(row)
    print(output)

