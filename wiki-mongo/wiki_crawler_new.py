import bs4 as bs
import urllib.request
from pymongo import MongoClient
import pymongo



def mongo_connection():
  mongo_URL = "mongodb://mongodb-stitch-olympics-xhlhd:***@cis550-shard-00-00-a0sk1.mongodb.net:27017,cis550-shard-00-01-a0sk1.mongodb.net:27017,cis550-shard-00-02-a0sk1.mongodb.net:27017/test?ssl=true&replicaSet=Cis550-shard-0&authSource=admin"
  client = MongoClient(mongo_URL)
  db = client.data.olympics_new
  return db

def main():
  col = mongo_connection()
  count = 0
  with open('Athlete_new.txt','r', encoding="utf-16") as f:
    for line in f:
      name = get_name(line)

      for n in name:
        athlete_info = find_info(n)
        if (athlete_info is not None and len(athlete_info) > 2):
          break

      if (athlete_info is not None):
        col.insert(athlete_info)
        # print (athlete_info)
        print (name,"success")
      
      

def get_name(raw_name):
  name_list = raw_name.replace("\"","").split()
  
  for i in range(len(name_list)):
    name_list[i] = name_list[i].strip().title()

  last_name = name_list[-1]
  first_name = name_list[0]

  if (len(name_list) >= 2):
    return [first_name + "_" + last_name]
  elif (len(name_list) > 2):
    return [first_name + "_" + last_name, "_".join(name_list)]
  else:
    return [last_name]


def find_info(name):
  try:
    url_string = "https://en.wikipedia.org/wiki/" + str(name)
    sause = urllib.request.urlopen(url_string).read()
  except UnicodeEncodeError:
    print (name + ": UnicodeEncodeError")
    athlete_info = {"link":url_string,"Name":" ".join(name.split("_"))}
    return athlete_info
  except urllib.error.HTTPError:
    print (name + ": HTTP Error 404: Not Found")
    athlete_info = {"link":url_string,"Name":" ".join(name.split("_"))}
    return athlete_info

  soup = bs.BeautifulSoup(sause,'html.parser')

  athlete_info = {}
  athlete_info["Name"] = " ".join(name.split("_"));

  table = soup.find('table',{"class" : "infobox vcard"})  
  try: 
    table_row = table.find_all('tr')

    ##limiting table items to 10
    for tr in table_row[0:9]:
      td = tr.find_all('td')
      th = tr.find_all('th')

      key = [i.text for i in th]
      value = [i.text for i in td]

      if(len(key) > 0 and len(value) > 0):
        athlete_info[key[0].replace(".","")] = value[0].strip()

    #print out the result
    # print (athlete_info)
    # for i in athlete_info:
    #   print(i + ":")
    #   print(athlete_info[i])

    # return athlete_info
    return athlete_info

  except AttributeError:
    athlete_info = {"link":url_string,"Name":" ".join(name.split("_"))}
    return athlete_info



main()
