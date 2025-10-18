#include<bits/stdc++.h>
using ll = long long;
const ll mod = 1e9+7;
using namespace std;

int main(){
    ios_base::sync_with_stdio(false);
    cin.tie(nullptr);

    int t;
    cin>>t;
    while(t--){
        int n;
        cin>>n;
        
        int maxavg = 0;
        for(int i = 0; i<n;i++){
            int a;
            cin>>a;
            if(a>maxavg){
                maxavg = a;
            }
        }
        cout<<maxavg<<endl;
    }

    return 0;
}