import bs4 as bs
import urllib.request


def main():
    count = 0
    with open('Athlete.txt','r', encoding="utf-16") as f:
      for line in f:
        count += 1
        name_list = line.split(",")
        if (count >= 2 and count <=100):           
            name = name_list[1].strip().strip("\"") + "_" + name_list[0].strip("\"").title()
            #athlete_info as a dictionary
            athlete_info = find_info(name)
            # if (athlete_info is not None):
            #   mongo_db(athlete_info)


#def mongo_db(athlete_info):
  #push into database

            


def find_info(name):
  try:
    sause = urllib.request.urlopen("https://en.wikipedia.org/wiki/" + name).read()
  except UnicodeEncodeError:
    print (name + ": UnicodeEncodeError")
    return
  except urllib.error.HTTPError:
    print (name + ": HTTP Error 404: Not Found")
    return
  soup = bs.BeautifulSoup(sause,'html.parser')

  athlete_info = {}
  athlete_info["Name"] = name;

  table = soup.find('table',{"class" : "infobox vcard"})  
  try: 
    table_row = table.find_all('tr')

    ##limiting table items to 10
    for tr in table_row[0:9]:
      td = tr.find_all('td')
      th = tr.find_all('th')

      key = [i.text for i in th]
      value = [i.text for i in td]

      if(len(key) > 0 and len(value)) > 0:
        athlete_info[key[0]] = value[0].strip()

    #print out the result
    print (athlete_info)
    for i in athlete_info:
      print(i + ":")
      print(athlete_info[i])

    # return athlete_info
    return athlete_info

  except AttributeError:
    print (name + ": no info")

main()
