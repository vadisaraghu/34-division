/* 34 Division — English / Telugu language support.
 *
 * The app renders English; when Telugu is selected, this file translates the
 * interface text as it appears on screen (text, placeholders, tooltips).
 * Voter names, streets and other data are never in the dictionary, so they
 * stay exactly as typed. Mark any element with data-nt to skip translation.
 */
(() => {
  'use strict';
  const KEY = '34div-lang';
  let lang = 'en';
  try { lang = localStorage.getItem(KEY) === 'te' ? 'te' : 'en'; } catch { /* storage blocked */ }

  // ------------------------------------------------------------ exact phrases
  const TE = {
    // shell & navigation
    'Dashboard': 'డాష్‌బోర్డ్', 'Add voter': 'ఓటరును చేర్చండి', 'Families': 'కుటుంబాలు', 'Voters': 'ఓటర్లు',
    'Review queue': 'సమీక్ష జాబితా', 'Admin': 'అడ్మిన్', 'admin': 'అడ్మిన్', 'volunteer': 'వాలంటీర్',
    'Upload list': 'జాబితా అప్‌లోడ్', 'Volunteers': 'వాలంటీర్లు', 'Export CSV': 'CSV డౌన్‌లోడ్',
    'Voter verification': 'ఓటరు ధృవీకరణ', 'Voter verification portal': 'ఓటరు ధృవీకరణ పోర్టల్',
    'Home': 'హోమ్', 'More': 'మరిన్ని', 'Review': 'సమీక్ష', 'Account': 'ఖాతా',

    // statistics
    'Statistics': 'గణాంకాలు', 'All statistics': 'అన్ని గణాంకాలు',
    'Progress of the verification, with filters.': 'ధృవీకరణ పురోగతి, ఫిల్టర్లతో.',
    'Download CSV': 'CSV డౌన్‌లోడ్', 'All volunteers': 'అందరు వాలంటీర్లు', 'From': 'నుండి', 'To': 'వరకు',
    'Today': 'ఈరోజు', 'Last 7 days': 'గత 7 రోజులు', 'Last 30 days': 'గత 30 రోజులు', 'All time': 'మొత్తం కాలం',
    'Clear filters': 'ఫిల్టర్లు తీసివేయండి', 'Verified per day': 'రోజువారీ ధృవీకరణలు', 'Data quality': 'డేటా నాణ్యత',
    'in this period': 'ఈ కాలంలో', 'per day': 'రోజుకు', 'Best day': 'అత్యధిక రోజు',
    'Voters with a second vote elsewhere': 'వేరే చోట కూడా ఓటు ఉన్న ఓటర్లు',
    'Names to check': 'తనిఖీ చేయాల్సిన పేర్లు', 'Name differs from the voter list': 'ఓటరు జాబితాలోని పేరుతో సరిపోలలేదు',
    'Waiting in review': 'సమీక్షలో వేచి ఉన్నవి', 'Uploaded rows to accept or discard': 'అంగీకరించాల్సిన / తొలగించాల్సిన అప్‌లోడ్ వరుసలు',
    'Serial not in voter list': 'సీరియల్ ఓటరు జాబితాలో లేదు', 'Check the serial number': 'సీరియల్ నంబర్ తనిఖీ చేయండి',
    'No door number': 'ఇంటి నంబర్ లేదు', 'Door number is empty': 'ఇంటి నంబర్ ఖాళీగా ఉంది',
    'Last added': 'చివరిగా చేర్చింది', 'Active days': 'పని చేసిన రోజులు', 'Last active': 'చివరి కార్యాచరణ',
    'Inactive': 'నిష్క్రియం', 'Family size': 'కుటుంబ పరిమాణం', 'Men and women': 'పురుషులు, స్త్రీలు',
    'Men': 'పురుషులు', 'Women': 'స్త్రీలు', 'Not in voter list': 'ఓటరు జాబితాలో లేరు',
    'Voters verified per family (one mobile number).': 'ఒక్కో కుటుంబంలో (ఒక మొబైల్ నంబర్) ధృవీకరించిన ఓటర్లు.',
    'From the voter list.': 'ఓటరు జాబితా ప్రకారం.', 'Verified / in the voter list.': 'ధృవీకరించినవి / ఓటరు జాబితాలో.',
    'Time of day': 'రోజులో సమయం', 'No streets': 'వీధులు లేవు', 'No volunteers': 'వాలంటీర్లు లేరు',
    'No families': 'కుటుంబాలు లేవు', 'No voters': 'ఓటర్లు లేరు', 'Nothing matches these filters.': 'ఈ ఫిల్టర్లకు ఏమీ సరిపోలలేదు.',
    'Show only this street': 'ఈ వీధి మాత్రమే చూపించు', 'Show only this volunteer': 'ఈ వాలంటీర్‌వి మాత్రమే చూపించు',
    '1 voter': '1 ఓటరు', '6 or more voters': '6 లేదా ఎక్కువ ఓటర్లు',

    // more than one vote
    'More than one vote': 'ఒకటి కంటే ఎక్కువ ఓట్లు',
    'People listed more than once in the voter list. Search any serial number to see all of that person’s serials.':
      'ఓటరు జాబితాలో ఒకటి కంటే ఎక్కువసార్లు ఉన్నవారు. ఏ సీరియల్ నంబర్ వెతికినా ఆ వ్యక్తి అన్ని సీరియల్స్ కనిపిస్తాయి.',
    'Duplicate vote: this person is already added at another serial': 'డబుల్ ఓటు: ఈ వ్యక్తిని ఇప్పటికే వేరే సీరియల్‌లో చేర్చారు',
    'Duplicate in the voter list: same person at another serial': 'ఓటరు జాబితాలో డూప్లికేట్: అదే వ్యక్తి వేరే సీరియల్‌లో ఉన్నారు',
    'Duplicate in the voter list': 'ఓటరు జాబితాలో డూప్లికేట్', 'Duplicate in voter list': 'ఓటరు జాబితాలో డూప్లికేట్',
    'Not added': 'చేర్చలేదు', 'Added more than once': 'ఒకటి కంటే ఎక్కువసార్లు చేర్చారు',
    'The voter list marks this entry as listed twice.': 'ఓటరు జాబితా ఈ ఎంట్రీని రెండుసార్లు ఉన్నట్లు చూపుతోంది.',
    'Search name, Telugu name, voter ID or serial': 'పేరు, తెలుగు పేరు, ఓటరు ID లేదా సీరియల్ వెతకండి',
    'Verified or not': 'ధృవీకరించినవి / కానివి', 'Not verified yet': 'ఇంకా ధృవీకరించలేదు',
    'All': 'అన్నీ', 'Same voter ID': 'ఒకే ఓటరు ఐడీ', 'Same name and house number': 'ఒకే పేరు, ఒకే ఇంటి నంబర్',
    'Duplicates': 'డూప్లికేట్లు', 'Check by hand': 'చేతితో తనిఖీ',
    'Same name and same father/husband (any age), with their serial numbers. Check them by hand so nobody is missed.':
      'ఒకే పేరు, ఒకే తండ్రి/భర్త (వయసు ఏదైనా), వారి సీరియల్ నంబర్లతో. ఎవరూ తప్పిపోకుండా చేతితో తనిఖీ చేయండి.',
    'Same house': 'ఒకే ఇల్లు', 'Same father/husband': 'ఒకే తండ్రి/భర్త', 'Similar age': 'దాదాపు ఒకే వయసు',
    'No other match': 'ఇంకేమీ సరిపోలలేదు', 'Duplicate': 'డూప్లికేట్', 'names': 'పేర్లు', 'entries': 'ఎంట్రీలు',
    'tap a name to compare': 'పోల్చడానికి పేరుపై నొక్కండి', 'Father/Husband': 'తండ్రి/భర్త',
    'Marked double vote': 'డబుల్ ఓటుగా గుర్తించారు',
    'Part': 'భాగం', 'Mark double vote': 'డబుల్ ఓటుగా గుర్తించు', 'Marked as double vote': 'డబుల్ ఓటుగా గుర్తించబడింది',
    'people': 'మంది', 'votes': 'ఓట్లు', 'voter list:': 'ఓటరు జాబితా:', 'Nobody found': 'ఎవరూ దొరకలేదు',
    'No one with more than one vote matches this search.': 'ఈ వెతుకులాటకు సరిపోయే ఎక్కువ ఓట్లు ఉన్నవారు లేరు.',
    'No one has more than one vote here.': 'ఇక్కడ ఎవరికీ ఒకటి కంటే ఎక్కువ ఓట్లు లేవు.',
    'The voter list isn’t uploaded yet': 'ఓటరు జాబితా ఇంకా అప్‌లోడ్ కాలేదు', 'Duplicates are found in the voter list.': 'నకిలీలు ఓటరు జాబితాలో వెతకబడతాయి.',

    // login / setup / sign-up
    'Every voter.': 'ప్రతి ఓటరు.', 'Counted once.': 'ఒక్కసారే లెక్క.',
    'Verify families street by street. Duplicates are caught automatically before they are saved.':
      'వీధి వీధిగా కుటుంబాలను ధృవీకరించండి. సేవ్ చేసే ముందే నకిలీలు ఆటోమేటిక్‌గా గుర్తించబడతాయి.',
    'Smart duplicate check on name, serial, mobile and street': 'పేరు, సీరియల్, మొబైల్, వీధి ఆధారంగా నకిలీ తనిఖీ',
    'Add a whole family in seconds': 'కొన్ని సెకన్లలో మొత్తం కుటుంబాన్ని చేర్చండి',
    'Every entry tracked to the volunteer who verified it': 'ప్రతి ఎంట్రీ ఏ వాలంటీర్ చేశారో నమోదు అవుతుంది',
    'Welcome back': 'స్వాగతం', 'Sign in to continue to 34 Division.': '34 డివిజన్‌లోకి లాగిన్ అవ్వండి.',
    'Username': 'యూజర్‌నేమ్', 'Password': 'పాస్‌వర్డ్', 'Sign in': 'లాగిన్',
    'New volunteer?': 'కొత్త వాలంటీరా?', 'Create an account': 'ఖాతా సృష్టించండి',
    'Already have an account?': 'ఇప్పటికే ఖాతా ఉందా?', 'Create your account': 'మీ ఖాతాను సృష్టించండి',
    'Volunteers can sign up here. Your admin must approve your account before you can sign in.':
      'వాలంటీర్లు ఇక్కడ నమోదు చేసుకోవచ్చు. లాగిన్ చేసే ముందు అడ్మిన్ మీ ఖాతాను ఆమోదించాలి.',
    'Full name': 'పూర్తి పేరు', 'Mobile number': 'మొబైల్ నంబర్', '(optional)': '(ఐచ్ఛికం)',
    'Choose a username': 'యూజర్‌నేమ్ ఎంచుకోండి',
    "3–30 letters or numbers, no spaces. You'll use this to sign in.": '3–30 ఇంగ్లీష్ అక్షరాలు లేదా అంకెలు, ఖాళీలు లేకుండా. లాగిన్‌కు ఇదే వాడతారు.',
    'Choose a password': 'పాస్‌వర్డ్ ఎంచుకోండి', 'At least 6 characters.': 'కనీసం 6 అక్షరాలు.',
    'Confirm password': 'పాస్‌వర్డ్ మళ్లీ ఇవ్వండి', 'Create account': 'ఖాతా సృష్టించు',
    'First-time setup': 'మొదటిసారి సెటప్', 'Create the admin account': 'అడ్మిన్ ఖాతా సృష్టించండి',
    'This is the first sign-in for 34 Division. The account you create now will be the admin. You can add volunteers after this.':
      '34 డివిజన్‌కు ఇది మొదటి లాగిన్. ఇప్పుడు సృష్టించే ఖాతా అడ్మిన్ అవుతుంది. తర్వాత వాలంటీర్లను చేర్చవచ్చు.',
    'Create admin account': 'అడ్మిన్ ఖాతా సృష్టించు', 'Account created': 'ఖాతా సృష్టించబడింది',
    'Your username:': 'మీ యూజర్‌నేమ్:',
    'Ask your admin to approve your account. Then you can sign in.': 'మీ ఖాతాను ఆమోదించమని అడ్మిన్‌ను అడగండి. ఆ తర్వాత లాగిన్ అవ్వవచ్చు.',
    'Go to sign in': 'లాగిన్‌కు వెళ్లండి', 'The two passwords do not match.': 'రెండు పాస్‌వర్డ్‌లు సరిపోలలేదు.',
    'Please wait…': 'దయచేసి వేచి ఉండండి…', 'Signing in…': 'లాగిన్ అవుతోంది…',
    'e.g. Ravi Kumar': 'ఉదా: రవి కుమార్', 'e.g. ravi': 'ఉదా: ravi',
    'Admin account created. Welcome!': 'అడ్మిన్ ఖాతా సృష్టించబడింది. స్వాగతం!',

    // dashboard
    "Here's how 34 Division is doing.": '34 డివిజన్ ప్రగతి ఇక్కడ చూడండి.',
    'Verified voters': 'ధృవీకరించిన ఓటర్లు', 'unique mobile numbers': 'వేర్వేరు మొబైల్ నంబర్లు',
    'Family votes': 'కుటుంబ ఓట్లు', 'total votes across families': 'అన్ని కుటుంబాల మొత్తం ఓట్లు',
    'Money given': 'డబ్బు ఇచ్చారు', 'Verifications · last 7 days': 'ధృవీకరణలు · గత 7 రోజులు',
    'Top volunteers': 'ఎక్కువ చేసిన వాలంటీర్లు', 'Recently verified': 'ఇటీవల ధృవీకరించినవి', 'View all': 'అన్నీ చూడండి',
    'Streets': 'వీధులు', 'Review now': 'ఇప్పుడు సమీక్షించండి', 'Review sign-ups': 'నమోదులు చూడండి',
    'No entries yet': 'ఇంకా ఎంట్రీలు లేవు', 'Volunteer activity will show up here.': 'వాలంటీర్ల పని ఇక్కడ కనిపిస్తుంది.',
    'No voters yet': 'ఇంకా ఓటర్లు లేరు', 'Start by adding the first voter.': 'మొదటి ఓటరును చేర్చి ప్రారంభించండి.',
    'No streets yet': 'ఇంకా వీధులు లేవు', 'Streets appear as voters are added.': 'ఓటర్లను చేర్చినప్పుడు వీధులు కనిపిస్తాయి.',

    // voter rows & badges
    'Already verified': 'ఇప్పటికే ధృవీకరించబడింది', 'Likely same': 'బహుశా అదే వ్యక్తి', 'Possible match': 'సరిపోలే అవకాశం',
    'Same family': 'అదే కుటుంబం', 'Verified': 'ధృవీకరించబడింది', 'See this family': 'ఈ కుటుంబాన్ని చూడండి',
    'Open family': 'కుటుంబం తెరవండి', 'Show family': 'కుటుంబం చూడండి', 'Edit': 'సవరించు', 'Delete': 'తొలగించు',

    // add voter
    'We check for duplicates while you type. Nothing is saved until you confirm.':
      'మీరు టైప్ చేస్తుండగానే నకిలీలను తనిఖీ చేస్తాం. మీరు నిర్ధారించే వరకు ఏదీ సేవ్ కాదు.',
    'Adding another member of the same family. Mobile, street and family votes are already filled in.':
      'అదే కుటుంబంలో మరో సభ్యుడిని చేరుస్తున్నారు. మొబైల్, వీధి, కుటుంబ ఓట్లు ఇప్పటికే నింపబడ్డాయి.',
    'Voter name': 'ఓటరు పేరు', 'e.g. Kandula Venkata Rao': 'ఉదా: కందుల వెంకట రావు', 'Serial number': 'సీరియల్ నంబర్',
    'e.g. 245': 'ఉదా: 245', 'Family mobile number': 'కుటుంబ మొబైల్ నంబర్',
    'One number for the whole family.': 'మొత్తం కుటుంబానికి ఒకే నంబర్.', 'Street name': 'వీధి పేరు',
    'Start typing to pick a street': 'వీధిని ఎంచుకోవడానికి టైప్ చేయండి', 'Notes': 'గమనికలు',
    'Anything the team should know': 'టీమ్‌కు తెలియాల్సిన విషయం', 'Verify & save': 'ధృవీకరించి సేవ్ చేయండి',
    'Clear form': 'ఫారం క్లియర్ చేయండి', 'Duplicate check': 'నకిలీ తనిఖీ', 'Decrease': 'తగ్గించు', 'Increase': 'పెంచు',
    'Start typing the name, serial number or mobile. Matching voters will appear here.':
      'పేరు, సీరియల్ నంబర్ లేదా మొబైల్ టైప్ చేయండి. సరిపోలే ఓటర్లు ఇక్కడ కనిపిస్తారు.',
    'Checking…': 'తనిఖీ చేస్తోంది…', 'Looking through verified voters.': 'ధృవీకరించిన ఓటర్లలో వెతుకుతోంది.',
    'This voter is already in the list and can’t be entered again.': 'ఈ ఓటరు ఇప్పటికే జాబితాలో ఉన్నారు, మళ్లీ నమోదు చేయలేరు.',
    'Check that this is a different person before saving. Highlighted fields match.':
      'సేవ్ చేసే ముందు ఇది వేరే వ్యక్తి అని నిర్ధారించుకోండి. హైలైట్ చేసిన వివరాలు సరిపోలాయి.',
    'No duplicates found': 'నకిలీలు లేవు',
    'This is a new member of a family that’s already in the list. You can save.': 'ఇది జాబితాలో ఉన్న కుటుంబానికి కొత్త సభ్యుడు. సేవ్ చేయవచ్చు.',
    'This looks like a new voter. You can save.': 'ఇది కొత్త ఓటరు. సేవ్ చేయవచ్చు.', 'See below ↓': 'కింద చూడండి ↓',
    'Enter the voter name.': 'ఓటరు పేరు నమోదు చేయండి.', 'Enter the serial number.': 'సీరియల్ నంబర్ నమోదు చేయండి.',
    'Enter a valid 10-digit mobile number.': 'సరైన 10 అంకెల మొబైల్ నంబర్ ఇవ్వండి.', 'Enter the street name.': 'వీధి పేరు నమోదు చేయండి.',
    'Family votes must be 1–99.': 'కుటుంబ ఓట్లు 1–99 మధ్య ఉండాలి.', 'Saving…': 'సేవ్ అవుతోంది…',
    'This voter was verified earlier, so it can’t be entered again.': 'ఈ ఓటరు ముందే ధృవీకరించబడ్డారు, మళ్లీ నమోదు చేయలేరు.',
    'OK, got it': 'సరే', 'Is this a different person?': 'ఇది వేరే వ్యక్తా?',
    'We found verified voters that look similar. Compare them carefully.': 'ఇలాంటి ధృవీకరించిన ఓటర్లు కనిపించారు. జాగ్రత్తగా పోల్చి చూడండి.',
    'I have checked these entries. This is a different person and should be added.': 'నేను ఈ ఎంట్రీలను తనిఖీ చేశాను. ఇది వేరే వ్యక్తి, చేర్చాలి.',
    'Same person, don’t add': 'అదే వ్యక్తి, చేర్చవద్దు', 'Add as new voter': 'కొత్త ఓటరుగా చేర్చండి',
    'New entry': 'కొత్త ఎంట్రీ', 'Serial no': 'సీరియల్', 'Mobile': 'మొబైల్', 'Street': 'వీధి',
    'Same voter': 'అదే ఓటరు', 'Possible': 'అవకాశం', 'New family created by': 'కొత్త కుటుంబం సృష్టించినవారు:',
    'Added to an existing family': 'ఉన్న కుటుంబంలో చేర్చబడింది', 'New family': 'కొత్త కుటుంబం',
    'Add family member': 'కుటుంబ సభ్యుడిని చేర్చండి',

    // voters list
    'Loading…': 'లోడ్ అవుతోంది…', 'Export': 'ఎగుమతి', 'All streets': 'అన్ని వీధులు',
    'Search name, serial, family ID, mobile or street': 'పేరు, సీరియల్, కుటుంబ ID, మొబైల్ లేదా వీధి వెతకండి',
    'No voters found': 'ఓటర్లు దొరకలేదు', 'Try a different search or street.': 'వేరే పదం లేదా వీధితో ప్రయత్నించండి.',
    'Verified voters will appear here.': 'ధృవీకరించిన ఓటర్లు ఇక్కడ కనిపిస్తారు.', 'Previous': 'ముందు', 'Next': 'తర్వాత',
    'Add member': 'సభ్యుడిని చేర్చండి', 'Show all': 'అన్నీ చూపించు', 'Delete this voter?': 'ఈ ఓటరును తొలగించాలా?',
    'Cancel': 'రద్దు', 'Deleting…': 'తొలగిస్తోంది…', 'Voter deleted': 'ఓటరు తొలగించబడ్డారు', 'Edit voter': 'ఓటరును సవరించండి',
    'Only the admin can edit verified voters.': 'ధృవీకరించిన ఓటర్లను అడ్మిన్ మాత్రమే సవరించగలరు.',
    'Save changes': 'మార్పులు సేవ్ చేయండి', 'Voter updated': 'ఓటరు వివరాలు మార్చబడ్డాయి',

    // families & money
    'Search family ID (F-0012), name, serial or mobile': 'కుటుంబ ID (F-0012), పేరు, సీరియల్ లేదా మొబైల్ వెతకండి',
    'All families': 'అన్ని కుటుంబాలు', 'Money pending': 'డబ్బు పెండింగ్', 'Money done for all': 'అందరికీ డబ్బు పూర్తి',
    'Created by anyone': 'ఎవరు సృష్టించినా', 'Created by me': 'నేను సృష్టించినవి', 'Family created by': 'కుటుంబం సృష్టించినవారు:',
    'Money': 'డబ్బు', 'by': 'చేసినవారు:', 'Undo': 'రద్దు చేయి', 'Tap to undo': 'రద్దు చేయడానికి నొక్కండి',
    'Money history': 'డబ్బు చరిత్ర', 'No families found': 'కుటుంబాలు దొరకలేదు',
    'Try a family ID like F-0012, a name or a mobile number.': 'F-0012 లాంటి కుటుంబ ID, పేరు లేదా మొబైల్‌తో ప్రయత్నించండి.',
    'Families appear when voters are added.': 'ఓటర్లను చేర్చినప్పుడు కుటుంబాలు కనిపిస్తాయి.',
    'Mark money given?': 'డబ్బు ఇచ్చినట్లు నమోదు చేయాలా?', 'Undo money given?': 'డబ్బు నమోదు రద్దు చేయాలా?',
    'Your name and the time will be recorded.': 'మీ పేరు, సమయం నమోదు అవుతాయి.',
    'The tick will be removed and can be given again later. Your name is recorded in the history.':
      'టిక్ తొలగించబడుతుంది, తర్వాత మళ్లీ ఇవ్వవచ్చు. మీ పేరు చరిత్రలో నమోదు అవుతుంది.',
    'Yes, money given': 'అవును, డబ్బు ఇచ్చారు', 'Yes, undo': 'అవును, రద్దు చేయి', 'Undone': 'రద్దు చేశారు',
    'No changes yet.': 'ఇంకా మార్పులు లేవు.', 'Close': 'మూసివేయి',

    // review
    'Uploaded entries that look like existing voters. Decide each one.': 'ఉన్న ఓటర్లలా కనిపించే అప్‌లోడ్ ఎంట్రీలు. ఒక్కొక్కటి నిర్ణయించండి.',
    'No matches any more. Safe to add.': 'ఇప్పుడు సరిపోలికలు లేవు. చేర్చవచ్చు.', 'Duplicate, discard': 'నకిలీ, తొలగించు',
    'Different person, add': 'వేరే వ్యక్తి, చేర్చు', 'All clear': 'అంతా పూర్తి',
    'There are no entries waiting for review.': 'సమీక్ష కోసం ఎంట్రీలు లేవు.', 'Adding…': 'చేరుస్తోంది…',
    'Discarding…': 'తొలగిస్తోంది…', 'Added as a new voter': 'కొత్త ఓటరుగా చేర్చబడింది', 'Discarded as duplicate': 'నకిలీగా తొలగించబడింది',

    // volunteers
    "Approve sign-ups or create logins for your team. Every verification is recorded under the volunteer's name.":
      'నమోదులను ఆమోదించండి లేదా టీమ్‌కు లాగిన్‌లు సృష్టించండి. ప్రతి ధృవీకరణ వాలంటీర్ పేరుతో నమోదు అవుతుంది.',
    'Waiting for approval': 'ఆమోదం కోసం వేచి ఉన్నారు', 'Pending': 'పెండింగ్', 'Reject': 'తిరస్కరించు', 'Approve': 'ఆమోదించు',
    'Team': 'టీమ్', 'Name': 'పేరు', 'Status': 'స్థితి', 'Active': 'యాక్టివ్', 'Disabled': 'నిలిపివేయబడింది',
    'Reset': 'రీసెట్', 'Disable': 'నిలిపివేయి', 'Enable': 'ప్రారంభించు', 'Add volunteer': 'వాలంటీర్‌ను చేర్చండి',
    'Role': 'పాత్ర', 'Volunteer': 'వాలంటీర్', 'Share this with the volunteer. They can change it later.': 'దీన్ని వాలంటీర్‌కు పంపండి. తర్వాత మార్చుకోవచ్చు.',
    'Create login': 'లాగిన్ సృష్టించు', 'Login created': 'లాగిన్ సృష్టించబడింది', 'Send these details to the volunteer.': 'ఈ వివరాలను వాలంటీర్‌కు పంపండి.',
    'Website': 'వెబ్‌సైట్', 'Done': 'పూర్తి', 'Reset password': 'పాస్‌వర్డ్ రీసెట్', 'New password': 'కొత్త పాస్‌వర్డ్',
    'Set password': 'పాస్‌వర్డ్ సెట్ చేయి', 'Password updated': 'పాస్‌వర్డ్ మార్చబడింది', 'Reject this sign-up?': 'ఈ నమోదును తిరస్కరించాలా?',
    'Volunteer approved. They can sign in now.': 'వాలంటీర్ ఆమోదించబడ్డారు. ఇప్పుడు లాగిన్ అవ్వవచ్చు.',
    'Sign-up rejected': 'నమోదు తిరస్కరించబడింది', 'Approving…': 'ఆమోదిస్తోంది…', 'Rejecting…': 'తిరస్కరిస్తోంది…', 'Creating…': 'సృష్టిస్తోంది…',
    'They will not be able to sign in.': 'వారు లాగిన్ అవ్వలేరు.',
    'Volunteer accounts are created by the admin.': 'వాలంటీర్ ఖాతాలను అడ్మిన్ మాత్రమే సృష్టిస్తారు.',

    // upload
    'Upload voter list': 'ఓటర్ల జాబితా అప్‌లోడ్',
    'Upload an Excel or CSV file. Exact duplicates are skipped. Look-alikes go to the review queue.':
      'Excel లేదా CSV ఫైల్ అప్‌లోడ్ చేయండి. ఖచ్చితమైన నకిలీలు వదిలేయబడతాయి. పోలినవి సమీక్ష జాబితాకు వెళ్తాయి.',
    'Drop your file here or tap to choose': 'ఫైల్‌ను ఇక్కడ వేయండి లేదా ఎంచుకోవడానికి నొక్కండి',
    'Excel (.xlsx, .xls) or CSV · first row must be column headings': 'Excel (.xlsx, .xls) లేదా CSV · మొదటి వరుసలో కాలమ్ శీర్షికలు ఉండాలి',
    'Match each field to a column in your file.': 'ప్రతి వివరాన్ని మీ ఫైల్‌లోని కాలమ్‌తో జతచేయండి.',
    'Not in file (use 1)': 'ఫైల్‌లో లేదు (1 వాడండి)', '— choose column —': '— కాలమ్ ఎంచుకోండి —', 'Preview': 'ప్రివ్యూ',
    'Upload complete': 'అప్‌లోడ్ పూర్తి', 'Added': 'చేర్చబడ్డాయి', 'skipped': 'వదిలేశారు', 'Needs review': 'సమీక్ష అవసరం',
    'Invalid rows': 'తప్పు వరుసలు', 'Open review queue': 'సమీక్ష జాబితా తెరవండి',
    'Rows that need fixing in your file': 'మీ ఫైల్‌లో సరిచేయాల్సిన వరుసలు', 'Row': 'వరుస', 'Problem': 'సమస్య',

    // reference voter list & door number
    'Door number': 'ఇంటి నంబర్', 'Door no': 'ఇంటి నం.', 'Name': 'పేరు', 'Serial no': 'సీరియల్ నం.',
    'e.g. 12-3-45': 'ఉదా: 12-3-45', 'Not in file': 'ఫైల్‌లో లేదు',
    'Reference list': 'రిఫరెన్స్ జాబితా', 'Verified voters': 'ధృవీకరించిన ఓటర్లు',
    'Upload reference voter list': 'రిఫరెన్స్ ఓటర్ల జాబితా అప్‌లోడ్',
    'The full voter list (name, serial number, door number). It is used only for suggestions on the Add voter form. Nobody is marked verified.':
      'పూర్తి ఓటర్ల జాబితా (పేరు, సీరియల్ నంబర్, ఇంటి నంబర్). ఇది ఓటరును చేర్చే ఫారంలో సూచనల కోసం మాత్రమే. ఎవరూ ధృవీకరించబడినట్లు గుర్తించబడరు.',
    'No reference list uploaded yet.': 'ఇంకా రిఫరెన్స్ జాబితా అప్‌లోడ్ చేయలేదు.',
    'No reference voter list uploaded yet, so there are no suggestions.': 'ఇంకా రిఫరెన్స్ ఓటర్ల జాబితా అప్‌లోడ్ చేయలేదు, కాబట్టి సూచనలు రావు.',
    'Upload it': 'అప్‌లోడ్ చేయండి', 'Clear list': 'జాబితా క్లియర్ చేయండి',
    'Clear the reference list?': 'రిఫరెన్స్ జాబితాను క్లియర్ చేయాలా?', 'Reference list cleared': 'రిఫరెన్స్ జాబితా క్లియర్ అయింది',
    'Updated': 'నవీకరించబడ్డాయి', 'already in the list': 'ఇప్పటికే జాబితాలో ఉన్నాయి', 'In the list now': 'ఇప్పుడు జాబితాలో',
    'Upload stopped part-way': 'అప్‌లోడ్ మధ్యలో ఆగిపోయింది', 'Go to Add voter': 'ఓటరును చేర్చే పేజీకి వెళ్లండి',
    'Clearing the old list…': 'పాత జాబితా క్లియర్ అవుతోంది…',

    // voter list (official roll), double vote, name checks
    'Voter list': 'ఓటర్ల జాబితా', 'Check names': 'పేర్లు తనిఖీ', 'Check name': 'పేరు తనిఖీ',
    'Search everyone in the ward’s voter list by name (English or Telugu), serial number, door number or voter ID.':
      'వార్డు ఓటర్ల జాబితాలో పేరు (ఇంగ్లీష్ లేదా తెలుగు), సీరియల్ నంబర్, ఇంటి నంబర్ లేదా ఓటరు ఐడీతో వెతకండి.',
    'Name, serial no, door no or voter ID': 'పేరు, సీరియల్, ఇంటి నంబర్ లేదా ఓటరు ఐడీ',
    'Search in: everything': 'అన్నింటిలో వెతకండి', 'Name or voter ID': 'పేరు లేదా ఓటరు ఐడీ', 'Search in': 'ఎక్కడ వెతకాలి',
    'The voter list isn’t uploaded yet': 'ఓటర్ల జాబితా ఇంకా అప్‌లోడ్ చేయలేదు',
    'Upload it from Upload list → Reference list.': 'జాబితా అప్‌లోడ్ → రిఫరెన్స్ జాబితా నుండి అప్‌లోడ్ చేయండి.',
    'Ask your admin to upload it.': 'అప్‌లోడ్ చేయమని అడ్మిన్‌ను అడగండి.', 'Upload voter list': 'ఓటర్ల జాబితా అప్‌లోడ్',
    'Search the voter list': 'ఓటర్ల జాబితాలో వెతకండి', 'No one found': 'ఎవరూ దొరకలేదు',
    'Try another spelling, or search by serial or door number.': 'వేరే స్పెల్లింగ్‌తో, లేదా సీరియల్ / ఇంటి నంబర్‌తో వెతకండి.',
    'Add': 'చేర్చు', 'Serial': 'సీరియల్', 'Door': 'ఇంటి నం.', 'Listed twice': 'రెండుసార్లు ఉంది',
    'Listed twice in the voter list': 'ఓటర్ల జాబితాలో రెండుసార్లు ఉంది',
    'Father:': 'తండ్రి:', 'Husband:': 'భర్త:', 'Mother:': 'తల్లి:', 'Relative:': 'బంధువు:',
    'Male': 'పురుషుడు', 'Female': 'స్త్రీ', 'Other': 'ఇతరులు',
    '. Check father’s name, age and door number.': '. తండ్రి పేరు, వయస్సు, ఇంటి నంబర్ చూసి ఎంచుకోండి.',
    'e.g. 11-250': 'ఉదా: 11-250', 'From the voter list': 'ఓటర్ల జాబితా నుండి', 'Change': 'మార్చు',
    'Name differs from the voter list': 'పేరు ఓటర్ల జాబితాతో సరిపోలలేదు', 'Voter list · serial': 'ఓటర్ల జాబితా · సీరియల్',
    'The name you typed is different from the voter list at this serial number. Check the serial number. If you save anyway, the admin will be asked to check it.':
      'మీరు టైప్ చేసిన పేరు ఈ సీరియల్ నంబర్‌లోని ఓటర్ల జాబితా పేరుతో సరిపోలలేదు. సీరియల్ నంబర్ చూసుకోండి. అలాగే సేవ్ చేస్తే అడ్మిన్ తనిఖీ చేస్తారు.',
    'This voter has a double vote (also listed somewhere else)': 'ఈ ఓటరుకు డబుల్ ఓటు ఉంది (వేరే చోట కూడా ఉంది)',
    'Where is the other vote? e.g. Ward 12, Guntur': 'మరో ఓటు ఎక్కడ ఉంది? ఉదా: వార్డు 12, గుంటూరు',
    'Double vote': 'డబుల్ ఓటు', 'No double vote': 'డబుల్ ఓటు లేదు', 'Mark as double vote': 'డబుల్ ఓటుగా గుర్తించండి',
    'Double votes': 'డబుల్ ఓట్లు', 'Double votes only': 'డబుల్ ఓట్లు మాత్రమే',
    'Does this voter also have a vote somewhere else?': 'ఈ ఓటరుకు వేరే చోట కూడా ఓటు ఉందా?',
    'Yes, this voter has a double vote': 'అవును, ఈ ఓటరుకు డబుల్ ఓటు ఉంది', 'Where is the other vote?': 'మరో ఓటు ఎక్కడ ఉంది?',
    'e.g. Ward 12, Guntur': 'ఉదా: వార్డు 12, గుంటూరు', 'Save': 'సేవ్',
    'The voter list isn’t uploaded yet, so volunteers get no name suggestions.': 'ఓటర్ల జాబితా అప్‌లోడ్ కాలేదు, కాబట్టి వాలంటీర్లకు పేర్ల సూచనలు రావు.',
    'Show': 'చూపించు',
    'If the serial number is in the voter list and the name is the same person, the official name is used.':
      'సీరియల్ నంబర్ ఓటర్ల జాబితాలో ఉండి, అదే వ్యక్తి అయితే జాబితాలోని అధికారిక పేరు వాడబడుతుంది.',
    'Saved voters whose name doesn’t match the voter list at their serial number. Pick the right person, or keep the name as typed.':
      'సీరియల్ నంబర్ ప్రకారం ఓటర్ల జాబితాతో పేరు సరిపోలని ఓటర్లు. సరైన వ్యక్తిని ఎంచుకోండి, లేదా టైప్ చేసిన పేరే ఉంచండి.',
    'Re-check all names': 'అన్ని పేర్లు మళ్లీ తనిఖీ', 'Saved as': 'సేవ్ అయిన పేరు', 'Voter list at serial': 'ఈ సీరియల్‌లో ఓటర్ల జాబితా',
    'Nobody is listed at this serial number.': 'ఈ సీరియల్ నంబర్‌లో ఎవరూ లేరు.', 'Use this name': 'ఈ పేరు వాడండి',
    'Closest names elsewhere in the list': 'జాబితాలో దగ్గరగా ఉన్న ఇతర పేర్లు', 'Move to serial': 'ఈ సీరియల్‌కు మార్చండి',
    'Keep “': '“', '” as typed': '” టైప్ చేసినట్లే ఉంచండి', 'All names match': 'అన్ని పేర్లు సరిపోయాయి',
    'Every saved voter matches the voter list at their serial number.': 'సేవ్ చేసిన ప్రతి ఓటరు పేరు ఓటర్ల జాబితాతో సరిపోయింది.',
    'Name updated from the voter list': 'ఓటర్ల జాబితా నుండి పేరు మార్చబడింది', 'Name kept as typed': 'టైప్ చేసిన పేరే ఉంచబడింది',
    'Checking…': 'తనిఖీ చేస్తోంది…', 'Voter list (search by name, serial, door)': 'ఓటర్ల జాబితా (పేరు, సీరియల్, ఇంటి నం.)',
    'The ward’s full voter list (Excel or CSV). It powers the name suggestions on Add voter, the Voter list page and the name checks. Nobody is marked verified by uploading it.':
      'వార్డు పూర్తి ఓటర్ల జాబితా (Excel లేదా CSV). ఓటరును చేర్చే ఫారంలో సూచనలు, ఓటర్ల జాబితా పేజీ, పేర్ల తనిఖీకి ఇది వాడబడుతుంది. అప్‌లోడ్ చేయడం వల్ల ఎవరూ ధృవీకరించబడరు.',
    'Name in Telugu': 'తెలుగులో పేరు', 'Relation (father / husband / mother)': 'సంబంధం (తండ్రి / భర్త / తల్లి)',
    'Father / husband name': 'తండ్రి / భర్త పేరు', 'Father / husband name in Telugu': 'తండ్రి / భర్త పేరు తెలుగులో',
    'Age': 'వయస్సు', 'Gender': 'లింగం', 'Voter ID': 'ఓటరు ఐడీ', 'Part number': 'విభాగం నంబర్',
    'Saved voters matched to the list': 'సేవ్ చేసిన ఓటర్లు జాబితాతో సరిపోల్చబడ్డారు',
    'Matching saved voters to the list…': 'సేవ్ చేసిన ఓటర్లను జాబితాతో సరిపోలుస్తోంది…', 'Was': 'ముందు', 'Now': 'ఇప్పుడు',

    // money dialog, family edit, one mobile = one family
    'Mark money given': 'డబ్బు ఇచ్చినట్లు గుర్తించండి', 'Money for': 'ఎవరికి డబ్బు', 'Who received the money?': 'డబ్బు ఎవరు తీసుకున్నారు?',
    'Someone else': 'వేరే వ్యక్తి', 'Name of the person who received it': 'డబ్బు తీసుకున్న వ్యక్తి పేరు',
    'Select everyone still waiting': 'మిగిలిన అందరినీ ఎంచుకోండి', 'Already given': 'ఇప్పటికే ఇచ్చారు', 'received by': 'తీసుకున్నవారు',
    'Received by': 'తీసుకున్నవారు', ', received by': ', తీసుకున్నవారు', 'Choose at least one person.': 'కనీసం ఒకరిని ఎంచుకోండి.',
    'Money is already marked for everyone in this family.': 'ఈ కుటుంబంలో అందరికీ డబ్బు ఇప్పటికే గుర్తించబడింది.',
    'Edit family': 'కుటుంబం సవరించు', 'Give money': 'డబ్బు ఇవ్వండి', 'Edited by': 'సవరించినవారు',
    'These details are shared by everyone in the family. Changes apply to all members.': 'ఈ వివరాలు కుటుంబం అందరికీ ఒకటే. మార్పులు అందరు సభ్యులకూ వర్తిస్తాయి.',
    'One mobile number belongs to one family only. A number already used by another family can’t be chosen.':
      'ఒక మొబైల్ నంబర్ ఒక కుటుంబానికే. వేరే కుటుంబం వాడుతున్న నంబర్ ఎంచుకోలేరు.',
    'Members': 'సభ్యులు', 'money given': 'డబ్బు ఇచ్చారు', 'Edit voter': 'ఓటరు సవరించు', 'Save family': 'కుటుంబం సేవ్ చేయండి',
    'This number already belongs to another family': 'ఈ నంబర్ ఇప్పటికే వేరే కుటుంబానిది',
    'Choose a different number. One mobile number can only be used by one family.': 'వేరే నంబర్ ఎంచుకోండి. ఒక మొబైల్ నంబర్ ఒక కుటుంబానికే.',
    'One number for the whole family. A number already used by a family can only be used to add members to that family.':
      'మొత్తం కుటుంబానికి ఒకే నంబర్. ఇప్పటికే ఒక కుటుంబం వాడుతున్న నంబర్‌తో ఆ కుటుంబానికే సభ్యులను చేర్చగలరు.',
    'Use a different number': 'వేరే నంబర్ వాడండి', 'This mobile number already belongs to a family': 'ఈ మొబైల్ నంబర్ ఇప్పటికే ఒక కుటుంబానిది',
    'One mobile number = one family. Add this voter to that family, or enter a different number for a new family.':
      'ఒక మొబైల్ నంబర్ = ఒక కుటుంబం. ఈ ఓటరును ఆ కుటుంబంలో చేర్చండి, లేదా కొత్త కుటుంబానికి వేరే నంబర్ ఇవ్వండి.',
    'This mobile number belongs to another family': 'ఈ మొబైల్ నంబర్ వేరే కుటుంబానిది', 'Saving will move': 'సేవ్ చేస్తే',

    // family history & review queue decisions
    'History': 'చరిత్ర', 'Everything that changed in this family, and who did it.': 'ఈ కుటుంబంలో జరిగిన ప్రతి మార్పు, ఎవరు చేశారు.',
    'Family created': 'కుటుంబం సృష్టించబడింది', 'with': 'తో', 'Added': 'చేర్చారు', 'from an upload': 'అప్‌లోడ్ నుండి',
    'from the review queue': 'సమీక్ష జాబితా నుండి', 'moved in': 'చేరారు', 'moved out': 'వెళ్లిపోయారు', 'from': 'నుండి',
    'Removed': 'తొలగించారు', 'Family details edited': 'కుటుంబ వివరాలు మార్చారు', 'No changes recorded yet.': 'ఇంకా మార్పులు లేవు.',
    'by': 'చేసినవారు',
    'Uploaded entries that need a decision: they look like a saved voter, or their mobile number already belongs to a family.':
      'నిర్ణయం అవసరమైన అప్‌లోడ్ ఎంట్రీలు: సేవ్ చేసిన ఓటరులా ఉన్నవి, లేదా మొబైల్ నంబర్ ఇప్పటికే ఒక కుటుంబానిది.',
    'Looks like a saved voter': 'సేవ్ చేసిన ఓటరులా ఉంది',
    'Decide whether this voter belongs to that family. If not, give them a different number.':
      'ఈ ఓటరు ఆ కుటుంబానికి చెందినవారో కాదో నిర్ణయించండి. కాకపోతే వేరే నంబర్ ఇవ్వండి.',
    'Discard': 'తీసివేయండి', 'Discarded': 'తీసివేయబడింది', 'New family mobile number': 'కొత్త కుటుంబ మొబైల్ నంబర్',
    'will be added with this number instead of': 'ఈ నంబర్‌తో చేర్చబడతారు, బదులుగా', 'Add with this number': 'ఈ నంబర్‌తో చేర్చండి',
    'This number also belongs to a family': 'ఈ నంబర్ కూడా ఒక కుటుంబానిది', 'Added with the new number': 'కొత్త నంబర్‌తో చేర్చబడింది',
    'Added to the family': 'కుటుంబంలో చేర్చబడింది',

    // account
    'Manage your login.': 'మీ లాగిన్ వివరాలు.', 'Install the 34 Division app': '34 డివిజన్ యాప్ ఇన్‌స్టాల్ చేయండి',
    'Opens full-screen from your home screen, like a normal app.': 'సాధారణ యాప్‌లాగే హోమ్ స్క్రీన్ నుంచి తెరుచుకుంటుంది.',
    'Install app': 'యాప్ ఇన్‌స్టాల్ చేయండి',
    'Tap the ⋮ menu, then “Add to Home screen” or “Install app”.': '⋮ మెనూ నొక్కి, “Add to Home screen” లేదా “Install app” ఎంచుకోండి.',
    'Tap the Share button, then “Add to Home Screen”.': 'Share బటన్ నొక్కి, “Add to Home Screen” ఎంచుకోండి.',
    'Menu': 'మెనూ', 'Families & money': 'కుటుంబాలు & డబ్బు', 'All voters': 'అందరు ఓటర్లు', 'Admin tools': 'అడ్మిన్ టూల్స్',
    'Export all voters (CSV)': 'అందరు ఓటర్లను డౌన్‌లోడ్ (CSV)', 'Sign out': 'లాగౌట్', 'Change password': 'పాస్‌వర్డ్ మార్చండి',
    'Current password': 'ప్రస్తుత పాస్‌వర్డ్', 'Update password': 'పాస్‌వర్డ్ మార్చు', 'Updating…': 'మారుస్తోంది…',
    'Language': 'భాష', 'Choose the language for this phone.': 'ఈ ఫోన్‌కు భాష ఎంచుకోండి.',

    // server messages
    'Wrong username or password.': 'యూజర్‌నేమ్ లేదా పాస్‌వర్డ్ తప్పు.',
    'Your account is waiting for admin approval. Please ask your admin to approve it.': 'మీ ఖాతా అడ్మిన్ ఆమోదం కోసం వేచి ఉంది. ఆమోదించమని అడ్మిన్‌ను అడగండి.',
    'Too many attempts. Try again in 15 minutes.': 'చాలా ప్రయత్నాలు. 15 నిమిషాల తర్వాత మళ్లీ ప్రయత్నించండి.',
    'Please sign in.': 'దయచేసి లాగిన్ అవ్వండి.', 'Session expired. Please sign in again.': 'సెషన్ ముగిసింది. మళ్లీ లాగిన్ అవ్వండి.',
    'Something went wrong. Please try again.': 'ఏదో పొరపాటు జరిగింది. మళ్లీ ప్రయత్నించండి.', 'Something went wrong.': 'ఏదో పొరపాటు జరిగింది.',
    'This voter is already verified.': 'ఈ ఓటరు ఇప్పటికే ధృవీకరించబడ్డారు.', 'Possible duplicate - please review.': 'నకిలీ కావచ్చు - దయచేసి పరిశీలించండి.',
    'Please enter the voter name.': 'ఓటరు పేరు నమోదు చేయండి.', 'Please enter the serial number.': 'సీరియల్ నంబర్ నమోదు చేయండి.',
    'Please enter the street name.': 'వీధి పేరు నమోదు చేయండి.', 'Family votes must be between 1 and 99.': 'కుటుంబ ఓట్లు 1–99 మధ్య ఉండాలి.',
    'That username is taken. Try another one.': 'ఈ యూజర్‌నేమ్ ఇప్పటికే ఉంది. వేరేది ప్రయత్నించండి.', 'That username is taken.': 'ఈ యూజర్‌నేమ్ ఇప్పటికే ఉంది.',
    'Enter your full name.': 'మీ పూర్తి పేరు ఇవ్వండి.', 'Username: 3-30 letters/numbers, no spaces.': 'యూజర్‌నేమ్: 3-30 అక్షరాలు/అంకెలు, ఖాళీలు లేకుండా.',
    'Password must be at least 6 characters.': 'పాస్‌వర్డ్ కనీసం 6 అక్షరాలు ఉండాలి.', 'Current password is wrong.': 'ప్రస్తుత పాస్‌వర్డ్ తప్పు.',
    'Money tick was already undone.': 'డబ్బు నమోదు ఇప్పటికే రద్దు చేయబడింది.', 'Voter not found.': 'ఓటరు దొరకలేదు.',
    'Only the admin can do this.': 'ఇది అడ్మిన్ మాత్రమే చేయగలరు.', 'Already handled by someone else.': 'ఇప్పటికే వేరొకరు పూర్తి చేశారు.',
  };

  const FIELD = { name: 'పేరు', 'similar name': 'పోలిన పేరు', 'serial no': 'సీరియల్', mobile: 'మొబైల్', street: 'వీధి' };

  // ------------------------------------------------------------ phrases with numbers / names
  const RULES = [
    [/^Good morning, (.+)$/, 'శుభోదయం, $1'],
    [/^Good afternoon, (.+)$/, 'నమస్కారం, $1'],
    [/^Good evening, (.+)$/, 'శుభ సాయంత్రం, $1'],
    [/^\+(\S+) today$/, 'ఈరోజు +$1'],
    [/^voters ticked · (\S+) streets$/, 'టిక్ చేసిన ఓటర్లు · $1 వీధులు'],
    [/^(\S+) total$/, 'మొత్తం $1'],
    [/^· (\S+) fam$/, '· $1 కుటుంబాలు'],
    [/^(\S+) uploaded (?:entry needs|entries need) a duplicate review\.$/, '$1 అప్‌లోడ్ ఎంట్రీలు నకిలీ సమీక్ష కోసం వేచి ఉన్నాయి.'],
    [/^(\S+) new volunteers? (?:is|are) waiting for your approval\.$/, '$1 కొత్త వాలంటీర్లు మీ ఆమోదం కోసం వేచి ఉన్నారు.'],
    [/^(\S+) family votes?$/, '$1 కుటుంబ ఓట్లు'],
    [/^Door (.+)$/, 'ఇంటి నం. $1'],
    [/^(\S+)% of (\S+) in the voter list$/, 'ఓటరు జాబితాలోని $2 లో $1%'],
    [/^(\S+) active days$/, '$1 పని రోజులు'],
    [/^(\S+) voters per family$/, 'కుటుంబానికి $1 ఓటర్లు'],
    [/^(\S+) not verified yet$/, '$1 ఇంకా ధృవీకరించలేదు'],
    [/^(\S+) volunteers · (\S+) days$/, '$1 వాలంటీర్లు · $2 రోజులు'],
    [/^(\d+) voters$/, '$1 ఓటర్లు'],
    [/^(\S+) years$/, '$1 ఏళ్లు'],
    [/^Busiest (\S+)$/, 'ఎక్కువ పని $1'],
    [/^(\d+) votes$/, '$1 ఓట్లు'],
    [/^Show more \((\S+) left\)$/, 'మరిన్ని చూపించు ($1 మిగిలాయి)'],
    [/^Part (.*)$/, 'భాగం $1'],
    [/^Also serial (.+)$/, 'సీరియల్ $1 లో కూడా'],
    [/^Same person listed (\d+) times: serial$/, 'ఒకే వ్యక్తి $1 సార్లు ఉన్నారు: సీరియల్'],
    [/^\. Only one of these is a real vote\.$/, '. వీటిలో ఒక్కటే అసలైన ఓటు.'],
    [/^Added (\d+) times$/, '$1 సార్లు చేర్చారు'],
    [/^(\d+) people named$/, '$1 మంది పేరు'],
    [/^\((\d+) of (\d+)\)$/, '($1 / $2)'],
    [/^Family (F-\d+) history$/, 'కుటుంబం $1 చరిత్ర'],
    [/^Mobile belongs to (F-\d+)$/, 'మొబైల్ $1 కుటుంబానిది'],
    [/^Different person, add to family (F-\d+)$/, 'వేరే వ్యక్తి, కుటుంబం $1లో చేర్చండి'],
    [/^Saving will add the voter to family (F-\d+)\.$/, 'సేవ్ చేస్తే ఓటరు కుటుంబం $1లో చేరతారు.'],
    [/^(\S+) with a mobile number that already belongs to a family$/, '$1 ఎంట్రీల మొబైల్ నంబర్ ఇప్పటికే ఒక కుటుంబానిది'],
    [/^Money marked for (\d+) people$/, '$1 మందికి డబ్బు గుర్తించబడింది'],
    [/^Edit family (F-\d+)$/, 'కుటుంబం $1 సవరించు'],
    [/^Members \((\d+)\)$/, 'సభ్యులు ($1)'],
    [/^Family (F-\d+) updated$/, 'కుటుంబం $1 మార్చబడింది'],
    [/^Adding to family (F-\d+)$/, 'కుటుంబం $1లో చేరుస్తున్నారు'],
    [/^This voter will join the (\d+) members? already in this family\.$/, 'ఈ ఓటరు ఈ కుటుంబంలోని $1 సభ్యులతో చేరతారు.'],
    [/^Add to family (F-\d+)$/, 'కుటుంబం $1లో చేర్చండి'],
    [/^Move to family (F-\d+) & save$/, 'కుటుంబం $1కి మార్చి సేవ్ చేయండి'],
    [/^into family (F-\d+)\. To keep them in their own family, change the number back\.$/, 'ను కుటుంబం $1కి మారుస్తుంది. వారి కుటుంబంలోనే ఉంచాలంటే నంబర్‌ను మళ్లీ మార్చండి.'],
    [/^This mobile number already belongs to family (F-\d+)\..*$/, 'ఈ మొబైల్ నంబర్ ఇప్పటికే కుటుంబం $1దే. ఆ కుటుంబంలో చేర్చండి లేదా వేరే నంబర్ వాడండి.'],
    [/^Money for (\d+) people$/, '$1 మందికి డబ్బు'],
    [/^(\d+) yrs · (Male|Female|Other)$/, (_, a, g) => `${a} సం. · ${{ Male: 'పురుషుడు', Female: 'స్త్రీ', Other: 'ఇతరులు' }[g]}`],
    [/^(\d+) yrs$/, '$1 సం.'],
    [/^Type a name \(English or Telugu\), serial number or door number to pick from the voter list \((\S+) voters\)\.$/,
      'ఓటర్ల జాబితా నుండి ఎంచుకోవడానికి పేరు (ఇంగ్లీష్ / తెలుగు), సీరియల్ లేదా ఇంటి నంబర్ టైప్ చేయండి ($1 ఓటర్లు).'],
    [/^(\S+) voters\. Type a name, serial number, door number \(e\.g\. 11-250\) or voter ID\.$/,
      '$1 ఓటర్లు. పేరు, సీరియల్, ఇంటి నంబర్ (ఉదా: 11-250) లేదా ఓటరు ఐడీ టైప్ చేయండి.'],
    [/^(\S+) saved voters?’s? names? (?:doesn’t|don’t) match the voter list at their serial number\.$/,
      '$1 ఓటర్ల పేర్లు సీరియల్ నంబర్ ప్రకారం ఓటర్ల జాబితాతో సరిపోలలేదు.'],
    [/^(\S+) saved voter’s name doesn’t match the voter list at their serial number\.$/, '$1 ఓటరు పేరు ఓటర్ల జాబితాతో సరిపోలలేదు.'],
    [/^(\S+) (?:voter has|voters have) a double vote\.$/, '$1 మందికి డబుల్ ఓటు ఉంది.'],
    [/^(.+): double vote marked$/, '$1: డబుల్ ఓటు గుర్తించబడింది'],
    [/^(.+): no double vote$/, '$1: డబుల్ ఓటు లేదు'],
    [/^(.+) is already verified(?: by (.+))?\.$/, (_, n, b) => `${n} ఇప్పటికే ధృవీకరించబడ్డారు${b ? ` (${b})` : ''}.`],
    [/^(\S+) names? changed to the official spelling\.(?: (\S+) needs? a check\.)?$/,
      (_, a, b) => `${a} పేర్లు అధికారిక స్పెల్లింగ్‌కు మార్చబడ్డాయి.${b ? ` ${b} తనిఖీ చేయాలి.` : ''}`],
    [/^Check (\S+) names?$/, '$1 పేర్లు తనిఖీ చేయండి'],
    [/^(\S+) names? updated from the voter list$/, '$1 పేర్లు ఓటర్ల జాబితా నుండి మార్చబడ్డాయి'],
    [/^Type a name or serial number to pick from the voter list \((\S+) voters\)\.$/, 'ఓటర్ల జాబితా నుండి ఎంచుకోవడానికి పేరు లేదా సీరియల్ నంబర్ టైప్ చేయండి ($1 ఓటర్లు).'],
    [/^(\S+) voters are in the reference list now\.$/, 'ప్రస్తుతం రిఫరెన్స్ జాబితాలో $1 ఓటర్లు ఉన్నారు.'],
    [/^All (\S+) reference voters will be removed\. Verified voters are not affected\.$/, 'మొత్తం $1 రిఫరెన్స్ ఓటర్లు తొలగించబడతారు. ధృవీకరించిన ఓటర్లపై ప్రభావం ఉండదు.'],
    [/^Replace the current reference list \(delete the (\S+) voters already in it first\)$/, 'ప్రస్తుత రిఫరెన్స్ జాబితాను మార్చండి (ముందుగా అందులోని $1 ఓటర్లను తొలగించండి)'],
    [/^(\S+) verified$/, '$1 ధృవీకరించారు'],
    [/^same (.+)$/, (_, f) => `${FIELD[f] || f} సరిపోలింది`],
    [/^(\S+) possible match(?:es)?$/, '$1 సరిపోలే అవకాశాలు'],
    [/^Family already verified on this mobile \((\d+)\)$/, 'ఈ మొబైల్‌పై ఇప్పటికే ఉన్న కుటుంబం ($1)'],
    [/^Already verified · (.+)$/, 'ఇప్పటికే ధృవీకరించారు · $1'],
    [/^(.+) is verified$/, '$1 ధృవీకరించబడ్డారు'],
    [/^Serial (.+)$/, 'సీరియల్ $1'],
    [/^Family (F-\d+)$/, 'కుటుంబం $1'],
    [/^(\S+) verified voters?(?: match your filters)?$/, '$1 ధృవీకరించిన ఓటర్లు'],
    [/^(\S+) famil(?:y|ies)(?: match your search)?$/, '$1 కుటుంబాలు'],
    [/^Page (\d+) of (\d+)$/, 'పేజీ $1 / $2'],
    [/^(\S+) shown$/, '$1 చూపబడ్డాయి'],
    [/^Showing the family with mobile (.+)$/, 'మొబైల్ $1 కుటుంబం'],
    [/^(\d+)\/(\d+) money$/, '$1/$2 డబ్బు'],
    [/^Money marked for (.+)$/, '$1 కు డబ్బు నమోదు అయింది'],
    [/^Money tick undone for (.+)$/, '$1 డబ్బు నమోదు రద్దు అయింది'],
    [/^Already ticked by (.+)\.$/, '$1 ఇప్పటికే టిక్ చేశారు.'],
    [/^(\S+) waiting(?: · showing the first \d+)?$/, '$1 వేచి ఉన్నాయి'],
    [/^Uploaded by (.+)$/, 'అప్‌లోడ్ చేసినవారు: $1'],
    [/^Signed up (.+)$/, 'నమోదు: $1'],
    [/^(\S+) rows$/, '$1 వరుసలు'],
    [/^Upload (\S+) voters$/, '$1 ఓటర్లను అప్‌లోడ్ చేయండి'],
    [/^Uploading… (.+)$/, 'అప్‌లోడ్ అవుతోంది… $1'],
    [/^Choose a column for: (.+)$/, 'ఈ వివరాలకు కాలమ్ ఎంచుకోండి: $1'],
    [/^Verified by (.+)$/, 'ధృవీకరించినవారు: $1'],
    [/^# (.+?) · added by (.+)$/, '# $1 · చేర్చినవారు: $2'],
    [/^(.+) verified$/, '$1 ధృవీకరించబడ్డారు'],
  ];

  const norm = (s) => String(s).replace(/\s+/g, ' ').trim();

  function t(s) {
    if (lang !== 'te' || s == null) return s;
    const k = norm(s);
    if (!k || !/[A-Za-z]/.test(k)) return s;
    if (TE[k]) return TE[k];
    for (const [re, rep] of RULES) if (re.test(k)) return k.replace(re, rep);
    return s;
  }

  function translateTextNode(node) {
    const v = node.nodeValue;
    const out = t(v);
    if (out !== v) node.nodeValue = v.match(/^\s*/)[0] + out + v.match(/\s*$/)[0];
  }

  const SKIP = '[data-nt],script,style,textarea';
  const ATTRS = ['placeholder', 'title', 'aria-label'];

  function apply(root) {
    if (lang !== 'te' || !root) return;
    if (root.nodeType === 3) {
      if (!(root.parentElement && root.parentElement.closest(SKIP))) translateTextNode(root);
      return;
    }
    if (root.nodeType !== 1 || root.closest(SKIP)) return;
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
      acceptNode: (n) => (n.parentElement && n.parentElement.closest(SKIP) ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT),
    });
    const nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    nodes.forEach(translateTextNode);
    [root, ...root.querySelectorAll('[placeholder],[title],[aria-label]')].forEach((el) => {
      if (el.closest(SKIP)) return;
      ATTRS.forEach((a) => {
        if (!el.hasAttribute(a)) return;
        const v = el.getAttribute(a);
        const o = t(v);
        if (o !== v) el.setAttribute(a, o);
      });
    });
  }

  function setLang(next) {
    try { localStorage.setItem(KEY, next === 'te' ? 'te' : 'en'); } catch { /* ignore */ }
    location.reload();
  }

  function start() {
    document.documentElement.lang = lang;
    document.documentElement.dataset.lang = lang;
    if (lang !== 'te') return;
    apply(document.body);
    new MutationObserver((muts) => muts.forEach((m) => m.addedNodes.forEach(apply)))
      .observe(document.body, { childList: true, subtree: true });
  }

  window.I18N = { get lang() { return lang; }, locale: lang === 'te' ? 'te-IN' : 'en-IN', t, setLang, apply };
  document.documentElement.lang = lang;
  document.documentElement.dataset.lang = lang;
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
  else start();
})();
