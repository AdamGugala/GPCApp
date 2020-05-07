# GPCApp

Test application for obtaining information about game prices from Steam and Gog stores

### TODO ###

- Web
	- Keeping first row and header at top while scrolling down
	- Add options to sort by title/price.
	- About page
	- Improving css style to comparing game prices
	- General imporoving of css style
	- Adding information on Steam/GOG Web API Terms of Use
	- clean the code/move functionality between services
	- Client functionality to remember prices (to consideration)
- API
	- The Steam ID game list has several games that repeat and have different IDs, of which only one is correct and redirects to the Steam store. Instead of creating a <string, int> dictionary, I will have to create a <string, List <int>> dictionary if it is possible and then when getting information from SteamAPI about subsequent games, I need to check which of these ids redirects to the store and display detailed data for it
	- warnings about versions
	- clean the code/move functionality between classes
