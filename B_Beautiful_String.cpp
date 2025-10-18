#include<bits/stdc++.h>
using ll = long long;
const ll mod = 1e9+7;
using namespace std;

int getmsb(int n){
    if(n==0) return -1;
    return 31 - __builtin_clz(n);
}

void solve(){
    int a,b;
    cin>>a>>b;

    if(a==b){
        cout<<0<<endl<<endl;
        return;
    }

    int msba = getmsb(a);
    int msbb = getmsb(b);

    if(msba> msbb){
        cout<<-1<<endl;
    }
    else if(msba > msbb){
        int x1 = a^(a|b);
        int intermediate = a^x1;
        int x2 = intermediate^b;

        cout<<2<<endl;
        cout<<x1<<" "<<x2<<endl;
    }
    else{
        cout<<1<<endl;
        cout<<(a^b)<<endl;
    }
}

int main(){
    ios_base::sync_with_stdio(false);
    cin.tie(nullptr);

    

    int t;
    cin>>t;
    while(t--){
        solve();
    }

    return 0;
}